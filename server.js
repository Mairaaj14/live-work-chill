const express = require("express");
var bodyParser = require("body-parser");
var passport = require('passport');
// var methodOverride = require('method-override');
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;

// var Sequelize = require('Sequelize');
// var session = require('express-session');
// var env = require('dotenv').load()

// Requiring our models for syncing
var db = require('./models');

// // Define middleware here
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("client/build"));

app.use(routes);


app.use(passport.initialize());
require("./config/passport");

var user;
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    function(req, res) {
        user = req.user;
        db.User.create(user)
        .then(data => console.log("data: ", data))
        .catch(err => console.log(err))
        console.log(req.user)
        var token = req.user.token;
        console.log(token)
        res.redirect("http:localhost:3000/paths");
        
    }
);

app.get("/logout", function(req, res) {
    console.log("logged out!");
    console.log("hello", user)
    user = null;
    req.logout();
    res.redirect('/');
});



// app.use(passport.session());

// // Serve up static assets (usually on heroku)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }

// // Creates connection with Sequelize
// const connection = new Sequelize('live_work_chill_db', 'root', 'password', {
//   host: 'localhost',
//   dialect: 'mysql',
//   operatorsAliases: false,
// });

// // Create instance of cors with Express
// app.use(cors());
// app.use(bodyParser.json());

// app.use(express.static(process.cwd() + '/public'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(methodOverride('_method'));

// // Initialize passport, express session and passport session
// app.use(session({
//   secret: process.env.PASSPORT_SECRET,
//   resave: true,
//   saveUninitialized: true
// })); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions

// // Routes - Import our auth.js file
// var authRoute = require('./controllers/auth.js')(app,passport); // Added passport as an argument to pass its functionality to auth.js

// load passport strategies
// require('./config/passport/passport.js')(passport, db.Users);



// Syncing our sequelize models and then starting our express app
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log(`App listening on PORT ${PORT} -- http://localhost:${PORT}/`); 
  });
});
 