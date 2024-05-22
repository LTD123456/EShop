"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const { router } = require("../app");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESH_TOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //which is key for accesstoken? which is key for refreshToken?
    //accessToken is signed with publicKey, refreshToken is signed with privateKey
    //how can i verify the accessToken? how can i verify the refreshToken?
    //accessToken is verified with publicKey, refreshToken is verified with privateKey
    //should I save private key to the database? should I save publicKey to the database?
    //no, you should not save the privateKey to the database, you should save the publicKey
    //to the database
    //if not save the privateKey to the database, how can I verify the refreshToken?
    //you can save the publicKey to the database, and use the publicKey to verify the refreshToken
    //what is the purpose of the refreshToken?
    //the refreshToken is used to generate a new accessToken when the accessToken is expired

    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    // what is refreshToken? refreshToken is a token that is used to generate a new accessToken
    //when the accessToken is expired

    JWT.verify(accessToken, publicKey, (e, decoded) => {
      if (e) {
        console.log(`error verify:::`, e);
      } else {
        console.log(`decoded verify:::`, decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1 check userId missing?
   * 2 get accessToken
   * 3 verify accessToken
   * 4 check user dbs
   * 5 check keyStore with userId
   * 6 ok all => return next()
   */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Error:::: Invalid Request!!!");

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Error:::: Not Found Key Store!!!");

  //3 verify accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Error:::: Invalid Request!!!");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Error:::: Invalid UserId!!!");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /**
   * 1 check userId missing?
   * 2 get accessToken
   * 3 verify accessToken
   * 4 check user dbs
   * 5 check keyStore with userId
   * 6 ok all => return next()
   */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Error:::: Invalid Request!!!");

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Error:::: Not Found Key Store!!!");

  //3 verify accessToken
  console.log(req.headers[HEADER.REFRESH_TOKEN]);
  if (
    req.url === "/shop/handlerRefreshToken" &&
    req.headers[HEADER.REFRESH_TOKEN]
  ) {
    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
    let decodeUser = {};
    try {
      decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
    } catch (error) {
      throw new AuthFailureError("Error:::: Invalid signature!!!");
    }

    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Error:::: Invalid UserId!!!");
    }

    req.refreshToken = refreshToken;
    req.user = decodeUser;
    req.keyStore = keyStore;

    return next();
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Error:::: Invalid Request!!!");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Error:::: Invalid UserId!!!");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  authenticationV2,
  verifyJWT,
};
