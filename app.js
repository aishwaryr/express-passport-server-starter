const express = require("express");
// const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
// const cors = require("cors");
// const session = require('express-session');
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const path = require("path");
// const cookieParser = require('cookie-parser');
// const passport = require('passport');
const promisify = require("es6-promisify");
// const flash = require('connect-flash');
// const expressValidator = require('express-validator');
const routes = require("./routes/index");
const helpers = require("./helpers");
const errorHandlers = require("./handlers/errorHandlers");

// create our Express app
const app = express();
// app.use(cors());

// view engine setup
// app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
// app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

app.use(express.static(`${__dirname}/public`));

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
// app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan("combined"));

// Takes the raw requests and turns them into usable properties on req.body

// type option - any type of request will be parsed
app.use(bodyParser.json({ type: "*/*" }));
// app.use(bodyParser.urlencoded({ extended: true }));

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// After allllll that above middleware, we finally handle our own routes!
app.use("/", routes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get("env") === "development") {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
