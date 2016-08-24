'use strict';

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/test';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected succesfully to server");

  db.close();
});

module.exports.register = function (server, options, next) {

    server.method({
        name: 'addUser',
        method: add,
        options: {}
    });

    return next();
};

module.exports.insert = function(server, options, next) {
    console.log(options);
}
