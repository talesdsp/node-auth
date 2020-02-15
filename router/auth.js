const router = require("express").Router();
const passport = require("passport");

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
