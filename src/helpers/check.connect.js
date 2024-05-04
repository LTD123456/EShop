'use strict'

const mongoose = require('mongoose');
const os   = require('os');
const process = require('process');
const _SECONDS = 5000;

const countConnect =()=>{
    const numConnection = mongoose.connections.length;
    console.log('Number of connection::', numConnection);
    return numConnection;
}

const checkOverload =()=>{
    setInterval(()=>{
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memUsage = process.memoryUsage().rss;//resident set size

        const maxConnections = numCores * 5;

        console.log('Number of connection::', numConnection);
        console.log('Number of cores::', numCores);
        console.log('Memories usage ::', memUsage /1024 / 1024, 'MB');
        
        if(numConnection > maxConnections){
            console.log('Overload connections detected::', numConnection);
        }

        countConnect()
    }, _SECONDS)// monitor every 5 seconds
}

module.exports = {
    countConnect, 
    checkOverload
} 