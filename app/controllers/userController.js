// Define Model
let userModel = require('../models/userModel');

// Read User Method
module.exports.read = function(req, res, next) { res.json(req.user); }

// Create New User
module.exports.create = async function(req, res, next) {
    try {
        let newUser = new userModel(req.body);
        let user = await userModel.create(newUser);
        return res.status(200).json(user);
    } catch (error) { next(error); }
}

// List All Users
module.exports.list = async function(req, res, next) {
    try {
        let userList = await userModel.find({});
        return res.status(200).json(userList);
    } catch (error) { next(error); }
}

// Find User By ID
module.exports.find = async function(req, res, next) {
    try {
        let userId = req.params.id;
        let user = await userModel.findById(userId, '-hashedPass -salt');
        return res.status(200).json(user);
    } catch (error) { next(error); }
}

// Update User Information By ID
module.exports.update = async function(req, res, next) {
    try {
        let userId = req.params.id;
        let user = userModel(req.body);
        // Update User By ID
        let result = await userModel.findByIdAndUpdate(userId, user);
        if(!result) throw res.status(404).json({ message: "User Not Found!" });
        // Get Updated User Information
        let updatedUser = await userModel.findById(userId);
        res.status(200).json(updatedUser);
    } catch (error) { next(error); }
}