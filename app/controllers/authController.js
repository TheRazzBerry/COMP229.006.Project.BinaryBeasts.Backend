// Define Module Dependencies
let jwt = require('jsonwebtoken');
let { expressjwt } = require('express-jwt');

// Define Environment Variable Dependencies
require('dotenv').config();
const SECRETKEY = process.env.JWT_SECRET;

// Define Model Dependencies
let userModel = require('../models/userModel');
let tournamentModel = require('../models/tournamentModel');

// Authorized Sign In
module.exports.signin = async function (req, res, next) {
    try {
        let user = await userModel.findOne({ 'email': req.body.email });
        if (!user) throw res.status(404).json({ message: 'User Not Found!' });
        if (!user.authenticate(req.body.password)) throw res.status(400).json({ message: 'Incorrect Password!' });
        // Define JWT Payload
        let payload = {
            name: user.name,
            email: user.email,
            id: user._id
        }
        // Sign JWT
        let signedToken = jwt.sign(payload, SECRETKEY, { algorithm: 'HS512' });
        res.status(200).json({
            message: 'JSON Web Token Recieved!',
            id: user._id,
            token: signedToken
        });
    } catch (error) { next(error); }
}

// Check for Signed In Status
module.exports.requireSignIn = expressjwt({
    secret: SECRETKEY,
    algorithms: ['HS512'],
    userProperty: 'auth'
});

// Get Tournaments By Auth Owner
module.exports.getMyTournaments = async function (req, res, next) {
    try {
        let userId = req.auth.id;
        if (!userId) return res.status(404).json({ message: 'Token ID Not Found!' });
        console.log(userId);
        let myTournamentsList = await tournamentModel.find({ owner: userId });
        res.status(200).json(myTournamentsList);
    } catch (error) { next(error); }
}

// Check for Authorization (User Operations)
module.exports.hasAuth = async function (req, res, next) {
    let authorized = req.auth && req.user && req.user.id == req.auth.id;
    if (!authorized) return res.status(403).json({ message: 'User Not Authorized!' });
    next();
}

// Check for Tournament Activation
module.exports.isTournamentActive = async function (req, res, next) {
    if (req.tournament.active) return res.status(200).json(req.tournament);
    next();
}

// Check for Authorization (Tournament Operations)
module.exports.isAllowed = async function (req, res, next) {
    let allowed = req.auth && req.tournament && req.tournament.owner == req.auth.id;
    if (!allowed) return res.status(403).json({ message: 'User Not Allowed!' });
    next();
}