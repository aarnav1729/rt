const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { seedEvents } = require('./utils/eventData');

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    await seedEvents();
    mongoose.disconnect();
  })
  .catch((err) => console.error('MongoDB connection error:', err));