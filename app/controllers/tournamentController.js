// Define Model
let tournamentModel = require('../models/tournamentModel');

// Create New Tournament
module.exports.create = async function(req, res, next) {
    try {
        let tournament = await tournamentModel.create(req.body);
        res.status(200).json(tournament);
    } catch (error) { next(error); }
}

// Get All Tournaments
module.exports.getAll = async function(re1, res, next) {
    try {
        let allTournamentsList = await tournamentModel.find({});
        res.status(200).json(allTournamentsList);
    } catch (error) { next(error); }
}

// Get Active Tournaments
module.exports.getActive = async function(req, res, next) {
    try {
        let activeTournamentsList = await tournamentModel.find({ active: true });
        res.status(200).json(activeTournamentsList);
    } catch (error) { next(error); }
}

// Get One Tournament By ID
module.exports.getOne = async function(req, res, next) {
    try {
        let tournamentId = req.params.id;
        req.tournament = await tournamentModel.findOne({ _id: tournamentId });
        next();
    } catch (error) { next(error); }
}

// Read User Method
exports.read = function(req, res, next) {
    res.json(req.tournament);
}

// Update Tournament Information By ID
module.exports.update = async function(req, res, next) {
    try {
        let tournamentId = req.params.id;
        let updatedTournament = tournamentModel(req.body);
        updatedTournament._id = tournamentId;
        //Update Tournament By ID
        let result = await tournamentModel.findByIdAndUpdate(tournamentId, updatedTournament);
        if(!result) throw res.status(500).json({ message: 'Update Failed!' });
        if(result.updatedCount < 1) throw res.status(404).json({ message: 'Tournament Not Found!' });
        res.status(200).json({ message: 'Successfully Updated Tournament With ID: ' + tournamentId });
    } catch (error) { next(error); }
}

// Delete Tournament By ID
module.exports.delete = async function(req, res, next) {
    try {
        let tournamentId = req.params.id;
        let result = await tournamentModel.deleteOne({ _id: tournamentId });
        if(!result) throw res.status(404).json({ message: 'Error! Nothing Was Deleted!' });
        res.status(200).json({ message: 'Deleted The Tournament With The ID: ' + tournamentId });
    } catch (error) { next(error); }
}