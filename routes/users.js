'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');
const Post = require('../models/post');

exports.register = function (server, options, next) {
    const userSchema = Joi.object({
        username: Joi.string().min(3).max(16).required(),
        email: Joi.string().max(32).email().required(),
        password: Joi.string().min(7).max(16).regex(/^[a-zA-Z0-9]{7,16}$/).required(),
        firstname: Joi.string().max(24).required(),
        lastname: Joi.string().max(24).required(),
    });

    server.route({
        method: 'GET',
        path: '/users',
        handler: function (request, reply) {
            server.app.User.test();
            reply().code(200);

        }
    });

    server.route({
        method: 'GET',
        path: '/users/{username}',
        handler: function (request, reply) {
            var user = server.app.User.findByUsername(request.params.username);
        }
    });

    server.route({
        method: 'POST',
        path: '/users/new',
        handler: function (request, reply) {

            var newUser = {
                username: request.payload.username,
                email: request.payload.email,
                password: request.payload.password,
                firstname: request.payload.firstname,
                lastname: request.payload.lastname
            }

            try {
                return reply(server.app.User.create(newUser));
            } catch (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }
        },   
        config: {
            validate: {
                payload: userSchema
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/users/{id}',
        handler: function (request, reply) {

            db.collections('users').update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        },
        config: {
            validate: {
                payload: Joi.object({
                    title: Joi.string().min(10).max(50).optional(),
                    author: Joi.string().min(10).max(50).optional(),
                    isbn: Joi.number().optional()
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/users/{id}',
        handler: function (request, reply) {

            db.collections('users').remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-users'
};
