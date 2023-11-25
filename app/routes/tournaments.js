// Define Module Dependencies
const express = require('express');

// Define Router
const router = express.Router();

// Define Model Dependencies
let tournamentController = require('../controllers/tournamentController');
let authController = require('../controllers/authController');

// Define Router Parameters
router.param('id', tournamentController.getOne);

// Define Basic Routes
router.get('/', (req, res, next) => { res.json({ message: 'tournaments.js root' }); });
router.get('/view/active', tournamentController.getActive);

// Define Development Routes
router.get('/view/all', tournamentController.getAll);

// Define Authorized Routes
router.get('/view/:id',
    authController.isTournamentActive,
    authController.requireSignIn,
    authController.isAllowed,
    tournamentController.read
);
router.post('/create', 
    authController.requireSignIn,
    tournamentController.create
);
router.put('/edit/:id', 
    authController.requireSignIn,
    authController.isAllowed,
    tournamentController.update
);
router.delete('/delete/:id',
    authController.requireSignIn,
    authController.isAllowed,
    tournamentController.delete
);

// Export Module
module.exports = router;