// Define Module Dependencies
const express = require('express');

// Define Router
const router = express.Router();

// Define Model Dependencies
const User = require('../models/userModel');

// Define Controllers
let userController = require('../controllers/userController');
let authController = require('../controllers/authController');

// Define Basic Routes
router.get('/', (req, res, next) => { res.json({ 'message' : 'users.js root' }); });
router.get('/find', userController.list);
router.get('/find/:id', userController.find);
router.post('/signup', userController.create);

// Define Authorized Routes
router.post('/signin', authController.signin);
router.put('/update/:id', 
    authController.requireSignIn,
    authController.hasAuth,
    userController.update    
);

// Export Module
module.exports = router;