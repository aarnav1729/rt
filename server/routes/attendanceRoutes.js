const express = require('express');
const { getEvents, getMembers, markAttendance } = require('../controllers/attendanceController');

const router = express.Router();

router.get('/events', getEvents);
router.get('/members', getMembers);
router.post('/mark', markAttendance);
router.post('/addMember', addMember);

module.exports = router;