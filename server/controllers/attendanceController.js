const Member = require("../models/Member");
const Event = require("../models/Event");
const Attendance = require("../models/Attendance");
const { sendEmail } = require("../utils/email");

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
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon1 - lon2) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return d;
};

const markAttendance = async (req, res) => {
  const { eventId, attendance, latitude, longitude } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const distance = calculateDistance(
      event.latitude,
      event.longitude,
      latitude,
      longitude
    );
    const twoMilesInMeters = 3218.69;
    if (distance > twoMilesInMeters) {
      return res
        .status(400)
        .json({
          message: "You are not within the allowed range to mark attendance",
        });
    }

    const existingAttendance = await Attendance.findOne({ eventId });
    const newAttendanceRecords = [];

    if (existingAttendance) {
      for (const member of attendance) {
        const existingRecord = existingAttendance.attendance.find(
          (record) => record.email === member.email
        );
        
        if (existingRecord) {
          // Update attendance only if there is a change
          if (!existingRecord.present && member.present) {
            existingRecord.present = member.present;
            // Increment only if member is being marked present for the first time
            await Member.updateOne(
              { email: member.email },
              { $inc: { attendanceCount: 1 } }
            );
          } else {
            existingRecord.present = member.present;
          }
        } else {
          newAttendanceRecords.push({
            email: member.email,
            present: member.present,
            emailSent: false,
          });

          // Increment attendance count only if marked present for the first time
          if (member.present) {
            await Member.updateOne(
              { email: member.email },
              { $inc: { attendanceCount: 1 } }
            );
          }
        }
      }
      existingAttendance.attendance = [
        ...existingAttendance.attendance,
        ...newAttendanceRecords,
      ];
      await existingAttendance.save();
    } else {
      for (const member of attendance) {
        newAttendanceRecords.push({
          email: member.email,
          present: member.present,
          emailSent: false,
        });

        // Increment attendance count only if marked present for the first time
        if (member.present) {
          await Member.updateOne(
            { email: member.email },
            { $inc: { attendanceCount: 1 } }
          );
        }
      }
      await Attendance.create({ eventId, attendance: newAttendanceRecords });
    }

    res.status(200).json({ message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMember = async (req, res) => {
  const { name, email } = req.body;

  try {
    const newMember = new Member({ name, email });
    await newMember.save();

    res.status(201).json({ message: "Member added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendEmails = async (req, res) => {
  const { eventId, attendance } = req.body;

  try {
    // Get the current date to filter past events
    const currentDate = new Date();

    // Count the number of past events
    const totalPastEvents = await Event.countDocuments({ date: { $lt: currentDate } });
    const totalEventsInYear = 48; // Assuming 4 events per month

    for (const member of attendance) {
      if (!member.emailSent) {
        const memberDetails = await Member.findOne({ email: member.email });
        const eventsAttended = memberDetails.attendanceCount; // Use attendanceCount from Member schema

        // Calculate extrapolated attendance only if there are past events
        const extrapolatedAttendance = totalPastEvents > 0
          ? ((eventsAttended / totalPastEvents) * totalEventsInYear).toFixed(2)
          : 'N/A';

        const emailContent = member.present
          ? `Your attendance was recorded, thank you for coming.\nYou have attended ${eventsAttended}/${totalPastEvents} events so far and are on track to attend approximately ${extrapolatedAttendance} out of 48 events this year!`
          : `We missed you, hope you're at the next one.\nYou have attended ${eventsAttended}/${totalPastEvents} events so far and are on track to attend approximately ${extrapolatedAttendance} out of 48 events this year!`;

        await sendEmail(member.email, member.present ? 'Attendance Recorded' : 'Missed Attendance', emailContent);
      }
    }

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error); // Log the detailed error
    res.status(500).json({ message: 'Error sending emails', error: error.message });
  }
};

// admin mark attendance
const adminMarkAttendance = async (req, res) => {
  const { eventId, attendance } = req.body;

  try {
    const existingAttendance = await Attendance.findOne({ eventId });
    const newAttendanceRecords = [];

    if (existingAttendance) {
      for (const member of attendance) {
        const existingRecord = existingAttendance.attendance.find(
          (record) => record.email === member.email
        );
        if (existingRecord) {
          // Update attendance only if there is a change
          if (!existingRecord.present && member.present) {
            existingRecord.present = member.present;
            // Increment only if member is being marked present for the first time
            await Member.updateOne(
              { email: member.email },
              { $inc: { attendanceCount: 1 } }
            );
          } else {
            existingRecord.present = member.present;
          }
        } else {
          newAttendanceRecords.push({
            email: member.email,
            present: member.present,
            emailSent: false,
          });

          // Increment attendance count only if marked present for the first time
          if (member.present) {
            await Member.updateOne(
              { email: member.email },
              { $inc: { attendanceCount: 1 } }
            );
          }
        }
      }
      existingAttendance.attendance = [
        ...existingAttendance.attendance,
        ...newAttendanceRecords,
      ];
      await existingAttendance.save();
    } else {
      for (const member of attendance) {
        newAttendanceRecords.push({
          email: member.email,
          present: member.present,
          emailSent: false,
        });

        // Increment attendance count only if marked present for the first time
        if (member.present) {
          await Member.updateOne(
            { email: member.email },
            { $inc: { attendanceCount: 1 } }
          );
        }
      }
      await Attendance.create({ eventId, attendance: newAttendanceRecords });
    }

    res
      .status(200)
      .json({ message: "Attendance marked successfully by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add event
const addEvent = async (req, res) => {
  const { name, date, latitude, longitude } = req.body;

  try {
    const newEvent = new Event({ name, date, latitude, longitude });
    await newEvent.save();
    res.status(201).json({ message: 'Event added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding event', error: error.message });
  }
};

module.exports = { getEvents, getMembers, markAttendance, addMember, sendEmails, adminMarkAttendance, addEvent };


module.exports = {
  getEvents,
  getMembers,
  markAttendance,
  addMember,
  sendEmails,
  adminMarkAttendance,
  addEvent,
};
