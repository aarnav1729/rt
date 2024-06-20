const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Member = require('./models/Member');

dotenv.config();

const members = [
  { name: 'meghana', email: 'meghana.kanade@premierenergies.com' },
  { name: 'akanksha', email: 'akanksha@premierenergies.com' },
  // Add more members as needed
];

const insertMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');

    await Member.insertMany(members);
    console.log('Members inserted');

    mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting members:', error);
  }
};

insertMembers();