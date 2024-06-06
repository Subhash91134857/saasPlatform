const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Community Admin', 'Community Member', 'Community Moderator'], default: 'Community Member' },
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }]
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)