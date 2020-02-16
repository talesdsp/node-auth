const router = require("express").Router();
const passport = require("passport");
const bcryptjs = require("bcryptjs");

const User = require("../model/User");

router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
    try {
      const hashedPassword = await bcryptjs.hash(req.body.password, 5);
      const newUser = new User({...req.body, password: hashedPassword});
      await User.create(newUser);
      res.redirect("/profile/");
    } catch {}
  });

router.route("/login").get((req, res) => {
  res.render("login");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post(
  "/local",
  passport.authenticate("local", {
    failureRedirect: "/auth/login"
  }),
  (req, res) => {
    res.redirect("/");
  }
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
