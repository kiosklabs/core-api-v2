'use strict';

const Hapi = require('hapi');

const Good = require('good');

// const cluster = require('cluster');
// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: process.env.PORT || 3000
});

//Load plugins and start server
server.register([{
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }},
    require('./lib/db'),
    require('./routes/books'),
    require('./routes/users')
    ], (err) => {

    if (err) {
        throw err;
    }

    // Start the server
    server.start((err) => {
        console.log('Server running at:', server.info.uri);
    });

});
