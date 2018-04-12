const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passportHandler = require("../handlers/passport");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requireSignin = passport.authenticate("local", { session: false });

router.get("/", requireAuth, (req, res) => {
  res.send({ hi: "there" });
});
router.post("/signin", requireSignin, authController.signin);
router.post("/signup", authController.signup);

module.exports = router;
