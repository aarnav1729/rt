const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Member = require('./models/Member');

dotenv.config();

const members = [
  { name: 'aarnav', email: 'aarnavsingh836@gmail.com'},
];

const insertMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {});
    console.log('MongoDB connected');

    await Member.deleteMany({});
    console.log('Existing members cleared');

    await Member.insertMany(members, { ordered: false });
    console.log('Members inserted');

    mongoose.disconnect();
  } catch (error) {
    if (error.code === 11000) {
      console.error('Duplicate key error:', error);
    } else {
      console.error('Error inserting members:', error);
    }
  }
};

insertMembers();