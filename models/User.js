// zcoder-backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  solvedCount: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  // --- ADD THESE NEW FIELDS ---
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' },
});

module.exports = mongoose.model('User', UserSchema);