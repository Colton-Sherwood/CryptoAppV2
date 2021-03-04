const express = require('express');
const router = express.Router();

// require userController
const userController = require('../controllers/userController');

//Login Page
router.get('/login', userController.renderLogin) 

//Register Page
router.get('/register', userController.renderRegister)

//Register Handle
router.post('/register', userController.registration)

// Login Handler
router.post('/login', userController.login)

// Logout Handler user passport's logout function
router.get('/logout', userController.logout)

module.exports = router;