const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  attendance: [
    {
      email: { type: String, required: true },
      present: { type: Boolean, required: true },
      emailSent: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Attendance', AttendanceSchema);