const cron = require('node-cron');
const Attendance = require('./models/Attendance');
const Member = require('./models/Member');
const { sendEmail } = require('./utils/email');

// Schedule a job to run at the end of every month
cron.schedule('0 0 1 * *', async () => {
  try {
    const members = await Member.find();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    
    const attendances = await Attendance.find({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth }
    });

    const memberAttendance = {};

    attendances.forEach(attendance => {
      attendance.attendance.forEach(record => {
        if (!memberAttendance[record.email]) {
          memberAttendance[record.email] = { attended: 0, missed: 0 };
        }
        if (record.present) {
          memberAttendance[record.email].attended += 1;
        } else {
          memberAttendance[record.email].missed += 1;
        }
      });
    });

    members.forEach(member => {
      const attendance = memberAttendance[member.email] || { attended: 0, missed: 0 };
      const subject = 'Monthly Attendance Summary';
      const text = `Hello ${member.name},\n\nYou attended ${attendance.attended} event(s) this month.`;
      sendEmail(member.email, subject, text);
    });
  } catch (error) {
    console.error('Error sending monthly summary emails:', error);
  }
});