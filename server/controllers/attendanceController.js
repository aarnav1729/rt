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

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c; // in metres
  return d;
}

const markAttendance = async (req, res) => {
  const { eventId, attendance, latitude, longitude } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Validate the user's location
    const distance = calculateDistance(event.latitude, event.longitude, latitude, longitude);
    const oneMileInMeters = 1609.34;
    if (distance > oneMileInMeters) {
      return res.status(400).json({ message: 'You are not within the allowed range to mark attendance' });
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