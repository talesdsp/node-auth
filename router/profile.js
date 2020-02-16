const router = require("express").Router();

const authChecker = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

router.get("/", authChecker, async (req, res) => {
  res.render("profile", {username: req.user.username, thumbnail: req.user.thumbnail});
});

module.exports = router;
