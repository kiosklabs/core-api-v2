'use strict';
var mg = require('mongoose');
var Promise = require('bluebird');
var Schema = mg.Schema;
var ValidationError = mg.Error.ValidationError;
var ValidatorError  = mg.Error.ValidatorError;

var moment = require('moment');

const internals = {};

//set mongodb schemas
internals.user = {};

internals.user.schema = new Schema({
  username:  { 
    type: String, 
    required: [true, 'username should be set.'],
    minlength: 3,
    maxlength: 16
  },
  email: {
    type: String,     
    maxlength: 32,
    required: [true, 'email should be set.'],
    validate: {
      validator: function(v) {
        var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailRegex.test(v);
      },
      message: 'please enter a valid email.'
    }
  },
  password: {
    type: String, 
    minlength: 7,
    maxlength: 16,
    required: [true, 'password should be set.'] 
  },
  created: {
    type: Date, 
    default: Date.now 
  },
  updated: {
    type: Date, 
    default: Date.now 
  },
  active: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'moderator', 'admin']
  },
  hidden: {
    type: Boolean,
    default: false 
  },
  firstname: {
    type: String,
    maxlength: 24,
    required: [true, 'first name should be set.'] 
  },
  lastname: {
    type: String,
    maxlength: 24,
    required: [true, 'last name should be set.'] 
  },
});

module.exports.findByID = function(id) {
    var UserModel = mg.model('User', internals.user.schema);
    UserModel.findOne({'_id': id}, '', function(err, result) {
        if (err) { throw err };
        console.log(result);
        return result;
    });
}

module.exports.findByUsername = function(username) {
    var UserModel = mg.model('User', internals.user.schema);
    UserModel.findOne({'username': username}, 'id', function(err, result) {
        if (err) { throw err };
        console.log(result);
        return result;
    });
}

module.exports.findByEmail = function(username) {
    var UserModel = mg.model('User', internals.user.schema);
    UserModel.findOne({'username': username}, 'id', function(err, result) {
        if (err) { throw err };
        console.log(result);
        return result;
    });
}

module.exports.create = function(data) {
    var UserModel = mg.model('User', internals.user.schema);
    var UserToSave = new UserModel(data);
    UserToSave.save(function(err){
        if (err) throw err;
    }).then(function(newuser) {
        console.log('user models ----');
        console.log(newuser);
    });
    
};

module.exports.update = function(data) {
    var UserModel = mg.model('User', internals.user.schema);
    var PostToSave = new UserModel(data);
    PostToSave.update({ _id: data._id }, { $set: data }, function(err) {
        if (err) throw err;
        console.log('updated successfully');
    });
}

module.exports.remove = function(data) {
    var UserModel = mg.model('User', internals.user.schema);
    var PostToSave = new UserModel(data);
    PostToSave.update({ _id: data._id }, { $set: data }, function(err) {
        if (err) throw err;
        console.log('updated successfully');
    });
}

module.exports.test = function (server, options) {
    var dummyData = {
      username:  'short',
      email: 'wrong@emailform.at',
      password: 'shortas',
      firstname: 'asasdasd',
      lastname: 'asasdasd'
    };

    internals.user.create(dummyData);

    var dummyData = {
      username:  'asasdasd',
      email: 'wrongmailform.at',
      password: 'aa',
      firstname: 'asasdasd',
      lastname: 'asasdasd'
    };

    internals.user.create(dummyData);

    // dummyData._id = '57bcf956737ebfd87fddd227';
    // dummyData.title = 'new test title';
    // internals.user.update(dummyData);
    // dummyData.title = 'test title';
    // delete dummyData._id;
    // interznals.user.create(dummyData);
    // internals.user.findByTitle('test title', true);
    // dummyData._id = '57bcf956737ebfd87fddd227';
    // dummyData.title = 'test title';
    // internals.user.update(dummyData);

    // dummyData._id = post._id;
    // dummyData.title = 'test title 2';

};
