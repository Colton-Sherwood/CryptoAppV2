const path = require("path")

// imports express package we installed with npm
const express = require("express")

// import mongoose to interact with MongoDB
const mongoose = require("mongoose")

// require handlebars so we can register a partial
const hbs = require('hbs')

const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

// initialized express application 
const app = express()

// Passport config
require('./config/passport')(passport)

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo using our key - if successful print 'MongoDB Connected' if not log the error
mongoose.connect(db, { useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// import router from router.js
const router = require("./Routes/router.js")

//configure middleware functions
// body parser middleware so that we can grab info from our forms.
app.use(express.urlencoded({ extended: false }))

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())

//converts all incoming json data
app.use(express.json())

//tells express to have access to everything in the public folder
app.use(express.static("public"))


// Setup a few global variables to use for messages

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// tells express to look for views in a directory called views
app.set("views", "views")

// tell express to use handlebars as the view engine
app.set("view engine", "hbs")

// tell hbs where partials are stored so that we can call them in views
hbs.registerPartials('./views/partials')

// tell the app to use the router we set up
app.use("/", require('./Routes/router.js') )
app.use("/user", require('./Routes/user.js'))


// Setup server to listen to requests
app.listen(3000, () => {
    console.log("The server is now running on Port 3000")
})