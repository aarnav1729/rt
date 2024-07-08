const express = require('express');
const { getEvents, getMembers, markAttendance, addMember, createEvent, updateEvent } = require('../controllers/attendanceController');

const router = express.Router();

router.get('/events', getEvents);
router.get('/members', getMembers);
router.post('/mark', markAttendance);
router.post('/member', addMember);
router.post('/event', createEvent); // Correct endpoint for creating events
router.put('/event/:id', updateEvent);

module.exports = router;