const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("../model/User");
const keys = require("./keys");
const bcryptjs = require("bcryptjs");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.log("deserialize", err.messsage);
  }
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    googleAuth
  )
);

passport.use(new LocalStrategy({usernameField: "email"}, localAuth));

async function googleAuth(accessToken, refreshToken, profile, done) {
  try {
    const currentUser = await User.findOne({googleId: profile.id});
    if (currentUser) {
      done(null, currentUser);
    } else {
      const newUser = await new User({
        googleId: profile.id,
        username: profile.displayName,
        thumbnail: profile._json.picture
      }).save();

      done(null, newUser);
    }
  } catch (err) {
    console.log("strategy", err.messsage);
  }
}

async function localAuth(email, password, done) {
  try {
    const user = await User.findOne({email: email});
    if (user === null) {
      return done(null, false, {message: "Incorrect email."});
    }
    if (validPassword(password, user.password) === false) {
      return done(null, false, {message: "Incorrect password."});
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

async function validPassword(p, hash) {
  return await bcryptjs.compare(p, hash);
}
