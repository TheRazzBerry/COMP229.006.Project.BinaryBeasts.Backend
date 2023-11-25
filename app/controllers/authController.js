// Define Module Dependencies
let jwt = require('jsonwebtoken');
let { expressjwt } = require('express-jwt');

// Define Environment Variables
require('dotenv').config;
var secretKey = process.env.JWT_SECRET;

// Define Model Dependencies
let userModel = require('../models/userModel');

// Authorized Sign In
module.exports.signin = async function(req, res, next) {
    try {
        let User = await userModel.findOne({ 'email' : req.body.email });
        if(!User) throw res.status(404).json({ message: 'User Not Found!' });
        if(!User.authenticate(req.body.password)) throw res.status(400).json({ message: 'Incorrect Password!' });
        // Define JWT Payload
        let payload = {
            id: User._id,
            email: User.email
        }
        // Sign JWT
        let signedToken = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS512' });
        return res.status(200).json({ message: 'JSON Web Token Recieved!', token: signedToken });
    } catch (error) { next(error); }
}

// Check for Signed In Status
module.exports.requireSignIn = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS512'],
    userProperty: 'auth'
});

// Check for Authorization
module.exports.hasAuth = async function(req, res, next) {
    let authorized = req.auth && req.user && req.user.id == req.auth.id;
    if(!authorized) { throw res.status(403).json({ message: 'User Not Authorized!' }); }
    next();
}