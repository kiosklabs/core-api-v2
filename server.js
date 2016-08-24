'use strict';

const Hapi = require('hapi');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const dbPort = "mongodb://127.0.0.1:27017/test" || process.env.MONGODB_URI;

// const cluster = require('cluster');
// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: process.env.PORT || 3000
});

mongoose.connect(dbPort);

//Load plugins and start server
server.register([
    require('./routes/books')
    ], (err) => {

    if (err) {
        throw err;
    }

    // Start the server
    server.start((err) => {
        console.log('Server running at:', server.info.uri);
    });

});
