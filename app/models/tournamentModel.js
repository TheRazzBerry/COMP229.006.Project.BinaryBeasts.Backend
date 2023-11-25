// Define Module Dependencies
const mongoose = require('mongoose');

// Create Schema
const tournamentSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    size: {
        type: Number,
        default: 8
    },
    teams: [{
        teamName: { type: String },
        teamNotes: { type: String }
    }],
    active: {
        type: Boolean,
        default: false
    },
}, { collection: 'tournaments' });

// Ensure Virtual Fields Are Serialized
tournamentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }
});

// Define Model And Export
const tournament = mongoose.model('Tournament', tournamentSchema);
module.exports = tournament;