const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  attendance: [
    {
      email: { type: String, required: true },
      present: { type: Boolean, required: true },
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;