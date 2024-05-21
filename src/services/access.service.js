"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
};
const crypto = require("crypto");
const { getInforData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    //step 1: check email is exist
    const hodelShop = await shopModel.findOne({ email }).lean(); //lean() is used to convert the mongoose object to plain javascript object
    //why? because we are not going to update the object, so we don't need the mongoose object

    if (hodelShop) {
      throw new BadRequestError("Error:::: Shop already register!!!");
    }

    const passwordHash = await bcrypt.hash(password, 10); //10 is the number of rounds to generate the salt
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      //created privateKey, publicKey
      //privateKey: used to generate the token
      //publicKey: used to verify the token
      // const{privateKey, publicKey} = crypto.generateKeyPairSync('rsa',// algorithm
      //     {
      //         modulusLength: 4096, //bits length of the key
      //         publicKeyEncoding:{
      //             type:"pkcs1",//type of the key
      //             //what is pkcs1? pkcs1 is a standard for public key cryptography
      //             format:"pem"//format of the key
      //             //which is pem? pem is a format for storing the key

      //         },
      //         privateKeyEncoding:{
      //             type:"pkcs1",//type of the key
      //             format:"pem"//format of the key
      //         }
      //     });

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log("key:::::::::::::::", privateKey, publicKey); //save collection KeyStore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error:::: Created keyStore unsuccess!!!");
      }
      console.log("key store:::::::::::::::::::", keyStore); //save collection KeyStore
      //created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`Created Token Success`, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInforData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  /*
    step 1: check email is existin dbs
    step 2: check password is correct
    step 3: create token pair AT and RT, save
    step 4: generate tokens
    step 5: get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Error:::: Shop not found!!!");
    }

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Error:::: Password is incorrect!!!");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    console.log(`Created Token Success`, tokens);
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInforData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("delete key store:::", delKey);
    return delKey;
  };

  /*
  check  token used 
  */
  static handleRefreshToken = async ({ refreshToken }) => {
    console.log(`refreshToken 1`, refreshToken);
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      //decode token xem token này của user nào
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log(`decoded token:::`, userId, email);
      //xóa các token cũ của user
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError(
        "Error:::: Some thing wrong happend!!! Please re-login!!!"
      );
    }

    //Not found token
    console.log(`refreshToken 2`, refreshToken);
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError("Error:::: Shop not registered ");
    }

    //verifyToken
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    console.log(`decoded token 2:::`, userId, email);
    //check userId
    const foundShop = await findByEmail({ email });

    if (!foundShop) {
      throw new AuthFailureError("Error:::: Shop not registered 2");
    }

    //create new token pair
    const tokens = await createTokenPair(
      { userId: userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = AccessService;
