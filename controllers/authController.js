const jwt = require("jwt-simple");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const promisify = require("es6-promisify");
const envs = process.env;

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