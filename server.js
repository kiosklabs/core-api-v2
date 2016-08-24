'use strict';

const Hapi = require('hapi');

// const cluster = require('cluster');
// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: process.env.PORT || 3000
});

//Load plugins and start server
server.register([
    require('./lib/db'),
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
