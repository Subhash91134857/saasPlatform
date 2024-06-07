const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    community: { type: String, ref: 'Community', required: true },
    user: { type: String, ref: 'User', required: true },
    role: { type: String, ref: 'Role', required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', memberSchema);