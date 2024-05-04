"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // const publicKeyString = publicKey.toString();//convert the public key to string
      //why? because the publicKey is a buffer, and we can't save the buffer in the database
      //what is buffer? buffer is a temporary storage for binary data

      // const tokens = await keyTokenModel.create({
      //     user:userId,
      //     publicKey,
      //     privateKey
      // })

      //return tokens? tokens.publicKey:null;

      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
