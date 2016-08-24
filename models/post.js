'use strict';
var mg = require('mongoose');
var Promise = require('bluebird');
var Schema = mg.Schema;
var moment = require('moment');

const internals = {};

//set mongodb schemas
internals.post = {};

internals.post.schema = new Schema({
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

internals.post.schema.statics.findByTitle = function(name, cb) {
  return this.find({ name: new RegExp(name, 'i') }, cb);
};


internals.post.findByID = function(id) {
    var PostModel = mg.model('Post', internals.post.schema);
    PostModel.findOne({'_id': id}, '', function(err, result) {
        if (err) { throw err };
        console.log(result);
        return result;
    });
}

internals.post.findByTitle = function(title, many) {
    var PostModel = mg.model('Post', internals.post.schema);
    if (many) {
        PostModel.find({'title': title}, 'id', function(err, result) {
            if (err) { throw err };
            console.log(result);
            return result;
        });
    } else {
        PostModel.findOne({'title': title}, 'id', function(err, result) {
            if (err) { throw err };
            console.log(result);
            return result;
        });
    }
}

internals.post.create = function(data) {
    var PostModel = mg.model('Post', internals.post.schema);
    var PostToSave = new PostModel(data);
    
    PostToSave.save(function(err) {
        if (err) throw err;
    });
    
    console.log('saved successfully!');

};

internals.post.update = function(data) {
    var PostModel = mg.model('Post', internals.post.schema);
    var PostToSave = new PostModel(data);
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

    internals.post.findByID('57bcf956737ebfd87fddd227');
    dummyData._id = '57bcf956737ebfd87fddd227';
    dummyData.title = 'new test title';
    internals.post.update(dummyData);
    dummyData.title = 'test title';
    delete dummyData._id;
    internals.post.create(dummyData);
    internals.post.findByTitle('test title', true);
    dummyData._id = '57bcf956737ebfd87fddd227';
    dummyData.title = 'test title';
    internals.post.update(dummyData);

    // dummyData._id = post._id;
    // dummyData.title = 'test title 2';

};
