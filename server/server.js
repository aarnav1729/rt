const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const attendanceRoutes = require('./routes/attendanceRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({ origin: 'https://rotraryattendancetracker.netlify.app' }));

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import and start cron jobs
require('./cronJobs');

app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));