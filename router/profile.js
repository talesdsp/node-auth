const router = require("express").Router();
const User = require("../model/User");

const authChecker = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authChecker, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("profile", {username: user.username, picture: user.thumbnail});
});

module.exports = router;
