const router = require("express").Router();
const passport = require("passport");
const bcryptjs = require("bcryptjs");

const User = require("../model/User");

router
  .route("/register")
  .get((req, res) => {
    req.user ? res.redirect("/profile") : res.render("register");
  })
  .post(
    createUser,
    passport.authenticate("local", {
      failureRedirect: "/auth/login",
      successRedirect: "/profile"
    })
  );

async function createUser(req, res, next) {
  try {
    const exist = await User.findOne({email: req.body.email});
    if (exist) {
      res.redirect("/auth/login");
    }
    const hashedPassword = await bcryptjs.hash(req.body.password, 5);
    await new User({...req.body, password: hashedPassword, thumbnail: ""}).save();
    next();
  } catch {}
}

router.route("/login").get((req, res) => {
  req.user ? res.redirect("/profile") : res.render("login");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post(
  "/local",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    successRedirect: "/profile"
  })
);

//auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile/");
});

module.exports = router;
