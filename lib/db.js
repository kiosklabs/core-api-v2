'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const dbPort = "mongodb://127.0.0.1:27017/test" || process.env.MONGODB_URI;

module.exports.register = function (server, options, next) {
    // Create the database connection 
    mongoose.connect(dbPort); 

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {  
      console.log('Mongoose default connection open to ' + dbPort);
    }); 

    // If the connection throws an error
    mongoose.connection.on('error',function (err) {  
      console.log('Mongoose default connection error: ' + err);
    }); 

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {  
      console.log('Mongoose default connection disconnected'); 
    });

    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function() {
      mongoose.connection.close(function () { 
        console.log('Mongoose default connection disconnected through app termination'); 
        process.exit(0); 
      }); 
    }); 

    // load schemas in server context
    server.app.Post = require('./../models/post'); 

    
    return next();
};

module.exports.register.attributes = {
    name: 'mongodb'
};
