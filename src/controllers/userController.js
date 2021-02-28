// Bring in user model
const User = require('../model/User');

// require bcrypt so we can encrypt passwords
const bcrypt = require('bcryptjs');

// require passport
const passport = require('passport');

exports.renderLogin = (req, res) => {
    res.render("login");
}

exports.renderRegister = (req, res) => {
    res.render("register", {layout: 'default'});
}

exports.registration = (req, res) => {
    // use destructuring to pull values from registration form into variables based on their 'name'
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields to make sure they have values
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'});
        console.log(errors);
    }

    // Check passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match.'});
        console.log(errors);
    }

    // Check pass length
    if(password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters.'});
        console.log(errors);
    }

    if(errors.length > 0) {
        res.render('register', {
            layout: 'default',
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        // Use mongoose Method findOne to check if user exists with the entered email
        User.findOne({ email: email })
          .then(user => {
              if(user) { 
                //if a user exists with that email render an error
                errors.push({ msg: "Email is already registered" })
                res.render('register', {
                    layout: 'default',
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
              } else {
                  // Create new instance of User - newUser - and pass in values from input
                  const newUser = new User({
                      name,
                      email,
                      password
                  });

                  // Hash password
                  bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        // Set newUser's password to the new hashed password
                        newUser.password = hash;
                        // Save user to MongoDB
                        newUser.save()
                          .then(user => {
                              req.flash('success_msg', 'You are now registered and can login.');
                              res.redirect('login');
                          })
                          .catch(err => console.log(err));
                    }))

              }
          });
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/purchase/account',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have logged out.');
    res.redirect('/user/login')
};


