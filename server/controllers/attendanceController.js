const Member = require('../models/Member');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');
const { sendEmail } = require('../utils/email');

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

    const presentMembers = [];
    const absentMembers = [];
    attendance.forEach(member => {
      if (member.present) {
        presentMembers.push(member.email);
      } else {
        absentMembers.push(member.email);
      }
    });

    await Attendance.create({ eventId, attendance });

    sendEmail(presentMembers, 'Attendance Appreciated', 'Thank you for attending the event.');
    sendEmail(absentMembers, 'You Were Missed', 'We missed you at the event. Hope to see you next time.');

    res.status(200).json({ message: 'Attendance recorded and emails sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getEvents, getMembers, markAttendance };