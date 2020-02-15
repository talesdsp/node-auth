const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("../model/User");
const keys = require("./keys");

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
    async (accessToken, refreshToken, profile, done) => {
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
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({username: username});
      console.log(user);

      // if (!user) {
      //   console.log(newUser);
      //   return done(null, false, {message: "Incorrect username."});
      // }
      if (!user && !user.validPassword(password)) {
        return done(null, false, {message: "Incorrect password."});
      }
      const newUser = await new User({username: username, password: password}).save();

      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  })
);
