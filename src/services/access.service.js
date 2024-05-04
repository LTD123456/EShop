"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
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
} = require("../core/error.response");

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
}

module.exports = AccessService;
