const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

// User Schema
const UserSchema = mongoose.Schema ({
  name: {
    type: String
  },
  email: {
    type: String,
    unique:true,
    required: true,
	  match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  username: {
    type: String,
  },
  emailVerificationToken: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  isVerified: { type: Boolean, default: false },
 
});

UserSchema.plugin(uniqueValidator);
const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById =(id, callback) => {
  User.findById(id, callback);
}
module.exports.getUserByEmail = (email) => {
  const query = {email: email}
 return User.findOne(query);
}
module.exports.getTokenByUrlToken = (token) => {
  const query = {emailVerificationToken:token}
 return User.findOne(query);
}

module.exports.comparePassword = (candidatePassword, hash) => {
   return bcrypt.compare(candidatePassword, hash)
  .then((isMatch) => {
    return isMatch;
  })
  .catch((err)=>{
    throw err;
  });
}
