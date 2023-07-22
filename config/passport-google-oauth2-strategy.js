const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID:"679108443211-v784fu00ioq9vanqtar6d4e7edovgj45.apps.googleusercontent.com",
        clientSecret:"8nvRqqh2ruPorbgW07r4JSfw",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },
    function(accessToken,refreshToken,profile,done){
        //find a user
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){console.log('error in the google-strategy-passport',err); return; }

            console.log(profile);

            if(user){
                //if found set this user as req.user
                return done(null,user);
            }else{
                //if not found, create user and set it as req.user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){console.log('error in the creating user google-strategy-passport',err); return; }

                    return done(null,user);
                })
            }

        })
    }
    ));

    module.exports = passport;