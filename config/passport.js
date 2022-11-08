const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
var opts = {};
const User = require('../models/user');
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(
	new JwtStrategy(opts, function (jwt_payload, done) {
		User.findOne({ email: jwt_payload.email }, function (err, user) {
			if (err) {
				return done(err, false);
			}
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
				// or you could create a new account
			}
		});
	})
);
