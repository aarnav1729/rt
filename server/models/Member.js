const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  attendanceCount: { type: Number, default: 0 }, 
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;