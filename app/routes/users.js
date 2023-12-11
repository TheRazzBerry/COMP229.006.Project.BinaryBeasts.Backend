// Define Module Dependencies
const express = require('express');

// Define Router
const router = express.Router();

// Define Model Dependencies
const userModel = require('../models/userModel');

// Define Controllers
let userController = require('../controllers/userController');
let authController = require('../controllers/authController');

// Define Router Parameters
router.param('id', userController.find);

// Define Basic Routes
router.get('/', (req, res, next) => { res.json({ message: 'users.js root' }); });
router.get('/find', userController.list);
router.post('/signup', userController.create);

// Define Authorized Routes
router.get('/find/:id', userController.read);
router.get('/tournaments',
    authController.requireSignIn,
    authController.getMyTournaments
);
router.post('/signin', authController.signin);
router.put('/update/:id',
    authController.requireSignIn,
    authController.hasAuth,
    userController.update
);
router.delete('/delete/:id',
    authController.requireSignIn,
    authController.hasAuth,
    userController.delete
);


// Export Module
module.exports = router;