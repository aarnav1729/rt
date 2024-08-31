const express = require('express');
const { getEvents, getMembers, markAttendance, addMember, sendEmails, adminMarkAttendance } = require('../controllers/attendanceController');

const router = express.Router();

router.get('/events', getEvents);
router.get('/members', getMembers);
router.post('/mark', markAttendance);
router.post('/addMember', addMember);
router.post('/sendEmails', sendEmails);
router.post('/admin/mark', adminMarkAttendance); // Corrected line

module.exports = router;