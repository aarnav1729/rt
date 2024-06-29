// attendanceController.js
const Member = require('../models/Member');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAttendance = async (req, res) => {
  const { eventId, attendance } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingAttendance = await Attendance.findOne({ eventId });
    const newAttendanceRecords = [];

    if (existingAttendance) {
      attendance.forEach(member => {
        const existingRecord = existingAttendance.attendance.find(record => record.email === member.email);
        if (existingRecord) {
          if (!existingRecord.emailSent) {
            if (member.present) {
              sendEmail(member.email, 'Attendance Recorded', 'Your attendance was recorded, thank you for coming.\nYou have attended 1/4 events this month!');
            } else {
              sendEmail(member.email, 'Missed Attendance', 'We missed you, hope you\'re at the next one.\nYou have attended 0/4 events this month!');
            }
            existingRecord.emailSent = true;
          }
          existingRecord.present = member.present;
        } else {
          newAttendanceRecords.push({
            email: member.email,
            present: member.present,
            emailSent: false,
          });
        }
      });
      existingAttendance.attendance = [...existingAttendance.attendance, ...newAttendanceRecords];
      await existingAttendance.save();
    } else {
      attendance.forEach(member => {
        if (member.present) {
          sendEmail(member.email, 'Attendance Recorded', 'Your attendance was recorded, thank you for coming.\nYou have attended 1/4 events this month!');
        } else {
          sendEmail(member.email, 'Missed Attendance', 'We missed you, hope you\'re at the next one.\nYou have attended 0/4 events this month!');
        }
        newAttendanceRecords.push({
          email: member.email,
          present: member.present,
          emailSent: true,
        });
      });
      await Attendance.create({ eventId, attendance: newAttendanceRecords });
    }

    res.status(200).json({ message: 'Attendance recorded and emails sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMember = async (req, res) => {
  const { name, email } = req.body;

  try {
    const newMember = new Member({ name, email });
    await newMember.save();

    res.status(201).json({ message: 'Member added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, getMembers, markAttendance, addMember };