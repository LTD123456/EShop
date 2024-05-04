'use strict'

const JWT = require('jsonwebtoken');
const createTokenPair = async(payload, publicKey, privateKey)=>{
    try{
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

        const accessToken = await JWT.sign(payload, publicKey,{
            expiresIn:'2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey,{
            expiresIn:'7 days'
        });
        // what is refreshToken? refreshToken is a token that is used to generate a new accessToken 
        //when the accessToken is expired 

        JWT.verify(accessToken, publicKey, (e, decoded)=>{
            if(e){
                console.log(`error verify:::`,e);
            }else{
                console.log(`decoded verify:::`,decoded);            
            }
        });

        return {accessToken, refreshToken}
    }catch(error){
        return error;
    }
}

module.exports ={
    createTokenPair
}