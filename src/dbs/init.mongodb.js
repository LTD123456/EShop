'use strict'
const mongoose = require('mongoose');
const {db:{host, name, port}} = require('../configs/configs.mongodb');
const { countConnect } = require('../helpers/check.connect');
const connectionString =`mongodb://${host}:${port}/${name}`;

//dev
class Database {
    constructor(){
        this._connect()
    }

    _connect(type ='mongodb'){
        if(1===1){
            mongoose.set('debug', true)
            mongoose.set('debug',{color:true})
        }

        console.log("connectionString: ", connectionString);
        mongoose.connect(connectionString)
        .then(_=> {
            console.log('DB Connected::::', countConnect())
        })
        .catch(err => console.log(err));
     }

     static getInstance(){
            if(!this._instance){
                this._instance = new Database()
            }
            return this._instance
     }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;