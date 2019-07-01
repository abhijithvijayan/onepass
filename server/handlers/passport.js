const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;

const { getUserDetails } = require('../db/user.js');

const jwtPassportOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(jwtPassportOptions, async (payload, cb) => {
        try {
            // find the user in db if needed
            const user = await getUserDetails({ email: payload.id });
            if (!user) {
                return cb(null, false);
            }
            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    })
);
