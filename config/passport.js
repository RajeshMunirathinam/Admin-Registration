const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');
const config = require('../config/database');
const _ = require('lodash');

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
	  
    jwt_payload = _.omit(jwt_payload,'data.password');
   
    User.getUserByEmail(jwt_payload.data.email)
	.then((user)=>{
      
		if(user) {
        return done(null,user);
      } else {
        return done(null, false);
      }
      if(err) {
        return done(err, false);
      }

	})
	.catch((err)=>{
	console.log(err);
	});
    
  }));
}
