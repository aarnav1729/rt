// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedEvents } = require('./utils/eventData');
const Member = require('./models/Member'); // Import Member model

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    
    // Reset attendanceCount for all members
    await resetMemberAttendanceCounts();

    // Seed events
    await seedEvents();
    
    mongoose.disconnect();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Function to reset attendanceCount for all members
const resetMemberAttendanceCounts = async () => {
  try {
    await Member.updateMany({}, { $set: { attendanceCount: 0 } });
    console.log("All members' attendance counts have been reset to 0.");
  } catch (error) {
    console.error('Error resetting members\' attendance counts:', error);
  }
};