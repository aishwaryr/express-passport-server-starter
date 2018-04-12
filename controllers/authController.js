const jwt = require("jwt-simple");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify = require("es6-promisify");
const envs = process.env;
// const mail = require("../handlers/mail");

// exports.login = passport.authenticate("local", {
//   failureRedirect: "/login",
//   failureFlash: "Failed Login",
//   successRedirect: "/",
//   successFlash: "You are now logged in!",
// });

// exports.logout = (req, res) => {
//   req.logout();
//   req.flash("success", "You are now logged out!");
//   res.redirect("/");
// };

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, envs.SECRET);
};

exports.signin = (req, res, next) => {
  // User has already had their email & pass auth'd
  // Just give them a token
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = async (req, res, next) => {
  // console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: "You must provide email and password" });
  }

  // See if email already exists
  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    // If user with email does exist , return err
    if (existingUser) {
      return res.status(422).send({ error: "Email is already in use" });
    }

    // else
    const user = new User({
      email,
      password,
    });

    user.save(err => {
      if (err) {
        return next(err);
      }

      // Respond to request saying usr was created
      res.json({ token: tokenForUser(user) });
    });
  });
  // res.send({ sucess: true });
};

// exports.forgot = async (req, res) => {
//   // 1. See if user with that email exists
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     req.flash("error", "No account with that email exists.");
//     return res.redirect("/login");
//   }
//   // 2. Set reset tokens and expiry on their account
//   user.resetPasswordToken = crypto.randomBytes(20).toString("hex");
//   user.resetPasswordExpires = Date.now() + 3600000;
//   await user.save();
//   // 3. Send them an email with the token
//   const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
//   mail.send({
//     user,
//     subject: "Password Reset",
//     resetURL,
//     filename: "password-reset",
//   });
//   req.flash("success", `You have been mailed a password reset link.`);
//   // 4. redirect to login page
//   res.redirect("/login");
// };

// exports.reset = async (req, res) => {
//   // check for token and it's expired or not
//   const user = await User.findOne({
//     resetPasswordToken: req.params.token,
//     resetPasswordExpires: { $gt: Date.now() },
//   });
//   if (!user) {
//     req.flash("error", "Password reset request is invalid or has expired");
//     return res.redirect("/login");
//   }
//   // if there is a user, show the reset pass form
//   res.render("reset", { title: "Reset Your Password" });
// };

// exports.confirmedPasswords = (req, res, next) => {
//   if (req.body.password === req.body["password-confirm"]) {
//     next();
//     return;
//   }
//   req.flash("error", "Passwords do not match");
//   res.redirect("back");
// };

// exports.update = async (req, res) => {
//   const user = await User.findOne({
//     resetPasswordToken: req.params.token,
//     resetPasswordExpires: { $gt: Date.now() },
//   });
//   if (!user) {
//     req.flash("error", "Password reset request is invalid or has expired");
//     return res.redirect("/login");
//   }

//   const setPassword = promisify(user.setPassword, user);
//   await setPassword(req.body.password);
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpires = undefined;
//   const updatedUser = await user.save();
//   await req.login(updatedUser);
//   req.flash("success", "Nice! Your Password has been reset! You are now logged in");
//   res.redirect("/");
// };
