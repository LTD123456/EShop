'use strict'

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService{
    static createKeyToken=async({userId, publicKey, privateKey})=>{
        try{
            // const publicKeyString = publicKey.toString();//convert the public key to string
            //why? because the publicKey is a buffer, and we can't save the buffer in the database
            //what is buffer? buffer is a temporary storage for binary data

            const tokens = await keyTokenModel.create({
                user:userId,
                publicKey,
                privateKey
            })

            return tokens? tokens.publicKey:null;
        }
        catch(error){
            return error;
        }
    }
}

module.exports= KeyTokenService;