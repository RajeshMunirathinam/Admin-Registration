const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const _ = require('lodash');
var crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');

// Register
router.post('/register', (req, res, next) => {
   
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
 
  return bcrypt.genSalt(10)
    .then((salt) => {
      return bcrypt.hash(newUser.password, salt)
    })
    .then((hash) => {
        newUser.password = hash;
        return newUser.save()
    })
    .then((user)=>{      
        let vt = crypto.randomBytes(16).toString('hex');
        user.emailVerificationToken = vt;
        user.save()
        var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: 'ravichandhar', pass: 'Ravi@2106916' } });
        var mailOptions = { from: 'no-reply@authenapp.com', to: newUser.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp://localhost:8080/users/confirmation\/' + vt + '\n' };
        transporter.sendMail(mailOptions)
        return res.json({success:true, msg:'User Registered'});
    })
    .catch(err => {
      return res.json({success: false, msg: 'Failed to register user'});
    });
  });
    
// Authenticate
router.post('/authenticate', (req, res, next) => {
  
  const email = req.body.email;
  const password = req.body.password;

  return User.getUserByEmail(email)
.then((user) => {
    if(!user) {
      return res.json({success: false, msg: 'User not found'});
    }
     if(!user.isVerified){
      return res.json({success: false, msg: 'You have not been Verified yet Please check your mail '});
    }
    

    return User.comparePassword(password, user.password)
.then((isMatch) => {
    if(isMatch) {
        let tokenUser = new User ({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
			      isVerified: user.isVerified
        });
        const token = jwt.sign({data:tokenUser}, config.secret, { expiresIn: 604800});
		      return res.json({
          success: true,
          token:token,
          user: {
            name: user.name,
            username: user.username,
            email: user.email,
            id: user._id
          }
        })
    }
    else { return res.json({success: false, msg: 'Wrong password'});}
})
}).catch((err)=>{
  return res.json({success: false, msg: 'Something went Wrong Please Try Again'});
})
});

router.get('/confirmation/:emailtoken', (req, res, next)=> {
  let token = req.params.emailtoken;
  
  return User.getTokenByUrlToken(token)
  .then((user)=>{
      if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
    
      user.isVerified = true;
      user.save()
      return res.status(200).send("The account has been verified. Please log in.")
  })
  .catch((err)=>{
    return res.status(400).send({ msg: 'We were unable to find a user for this token.' })
  })    
  });
// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
