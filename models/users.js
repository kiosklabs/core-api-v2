'use strict';
var mg = require('mongoose');
var Promise = require('bluebird');
var Schema = mg.Schema;
var moment = require('moment');

const internals = {};

//set mongodb schemas
internals.user = {};

internals.user.schema = new Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});

internals.user.schema.statics.findByTitle = function(name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb);
};


internals.user.findByID = function(id) {
    var UserModel = mg.model('User', internals.user.schema);
    UserModel.findOne({'_id': id}, '', function(err, result) {
        if (err) { throw err };
        console.log(result);
        return result;
    });
}

internals.user.findByTitle = function(title, many) {
    var UserModel = mg.model('User', internals.user.schema);
    if (many) {
        UserModel.find({'title': title}, 'id', function(err, result) {
            if (err) { throw err };
            console.log(result);
            return result;
        });
    } else {
        UserModel.findOne({'title': title}, 'id', function(err, result) {
            if (err) { throw err };
            console.log(result);
            return result;
        });
    }
}

internals.user.create = function(data) {
    var UserModel = mg.model('User', internals.user.schema);
    var PostToSave = new UserModel(data);
    
    PostToSave.save(function(err) {
        if (err) throw err;
    });
    
    console.log('saved successfully!');

};

internals.user.update = function(data) {
    var UserModel = mg.model('User', internals.user.schema);
    var PostToSave = new UserModel(data);
    PostToSave.update({ _id: data._id }, { $set: data }, function(err) {
        if (err) throw err;
        console.log('updated successfully');
    });
}

module.exports.test = function (server, options) {
    var dummyData = {
      title:  'test title',
      author: 'test author',
      body:   'test body',
      comments: [{ body: 'test comment body', date: moment().format() }],
      date: moment().format(),
      hidden: false,
      meta: {
        votes: 1,
        favs:  1
      }
    };

    internals.user.findByID('57bcf956737ebfd87fddd227');
    dummyData._id = '57bcf956737ebfd87fddd227';
    dummyData.title = 'new test title';
    internals.user.update(dummyData);
    dummyData.title = 'test title';
    delete dummyData._id;
    internals.user.create(dummyData);
    internals.user.findByTitle('test title', true);
    dummyData._id = '57bcf956737ebfd87fddd227';
    dummyData.title = 'test title';
    internals.user.update(dummyData);

    // dummyData._id = post._id;
    // dummyData.title = 'test title 2';

};
