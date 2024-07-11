const express = require('express');
const { getEvents, getMembers, markAttendance, addMember, sendEmail } = require('../controllers/attendanceController');

const router = express.Router();

router.get('/events', getEvents);
router.get('/members', getMembers);
router.post('/mark', markAttendance);
router.post('/addMember', addMember);
router.post('/send-email', (req, res) => {
  const { email, subject, text } = req.body;
  sendEmail(email, subject, text);
  res.status(200).json({ message: 'Email sent' });
});

module.exports = router;