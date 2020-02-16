const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieSession = require("cookie-session");
const path = require("path");
const authRoutes = require("./router/auth");
const profileRoutes = require("./router/profile");

const passportSetup = require("./config/passport-setup");
const keys = require("./config/keys");
const logger = require("morgan");

mongoose.connect(
  "mongodb://127.0.0.1:27017/oauth",
  {useNewUrlParser: true, useUnifiedTopology: true},
  () => {
    console.log("mongo connected");
  }
);

const app = express();
app.use(logger("dev"));
app.set("views", path.join(__dirname + "/views"));
app.set("view engine", "ejs");
app.set(express.static(__dirname + "/public"));

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);
// app.use(function(req, res, next) {
//   // Update views
//   req.session.views = (req.session.views || 0) + 1;

//   // Write response
//   res.end(req.session.views + " views");
// });

app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: true}));
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.listen(9876, () => console.log("running on 9876"));
