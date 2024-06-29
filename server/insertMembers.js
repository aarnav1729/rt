const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Member = require('./models/Member');

dotenv.config();

const members = [
  { name: 'Achala Kumar', email: 'kumarachala@hotmail.com' },
  { name: 'Amit Sanghi', email: 'mitsanghi2013@gmail.com' },
  { name: 'Ananth Rao', email: 'araomobile@yahoo.com' },
  { name: 'Anurag Sharma', email: 'anuragsharmaips17@gmail.com' },
  { name: 'Bhawant Anand', email: 'bhawantanand@gmail.com' },
  { name: 'Brijesh Chandwani', email: 'brijesh@keus.in' },
  { name: 'Chiranjeev Saluja', email: 'saluja@premierenergies.com' },
  { name: 'Dr Tanuja Khurana', email: 'drtanuja.diet@gmail.com' },
  { name: 'Dr Vinayak Pampati', email: 'vkpampati@gmail.com' },
  { name: 'Girish Gelli', email: 'ggelli@gmail.com' },
  { name: 'Gulab Shrimal', email: 'shrimalgulab@gmail.com' },
  { name: 'Jeny Gupta', email: 'jenygupta@hotmail.com' },
  { name: 'Tarun Gupta', email: 'orion.tarun@gmail.com' },
  { name: 'Narender Surana', email: 'narender@surana.com' },
  { name: 'Niraj Gelli', email: 'niraj.gelli@gmail.com' },
  { name: 'Patanjali Rao', email: 'pat.upadrasta@gmail.com' },
  { name: 'Ragunathan Kannan', email: 'raguk@sathguru.com' },
  { name: 'Raja Bommidala', email: 'raja@bbmbommidala.com' },
  { name: 'Rajashekhar Vodela', email: 'rajvodela@novadb.in' },
  { name: 'Rani Reddy', email: 'reddyrani27@gmail.com' },
  { name: 'Ravinder Agarwal', email: 'ravinder@dukesindia.com' },
  { name: 'Ravinder Nath', email: 'bravindernath2005@gmail.com' },
  { name: 'Samir Bhagath', email: 'me@samirbhagat.in' },
  { name: 'Sandip Patnaik', email: 'sandip.patnaik@ap.jll.com' },
  { name: 'Sanjay Gulabani', email: 'sanjay@pmangatram.com' },
  { name: 'Sanjay Jain DeenDayal', email: 'sanjay@av-visionindia.co.in' },
  { name: 'Sanjeev Singh', email: 'sanjre@hotmail.com' },
  { name: 'Shyam Pal Reddy', email: 'shyam@palreddy.in' },
  { name: 'Sridhar Lagadapati', email: 'sridhar.lagadapati@gmail.com' },
  { name: 'Suneel Vadlamudi', email: 'suneelv@gmail.com' },
  { name: 'Sunil Saraf', email: 'sunilsarafhyd@gmail.com' },
  { name: 'Sunita G Kumar', email: 'cmd@maaent.com' },
  { name: 'Sushil Goenka', email: 'sushil@fff.co.in' },
  { name: 'Uday Pilani', email: 'udaypilani@gmail.com' },
  { name: 'Veer Prakash', email: 'veeru.op@gmail.com' },
  { name: 'Vijay Vishal Reddy', email: 'vijay.vishal@gmail.com' },
  { name: 'Yashwant Jhabakh', email: 'yashwant@mahavirhyd.com' },
  { name: 'Dimple Agarwal', email: 'wellnesslanguage@gmail.com' },
  { name: 'Shiwani Tibrewala', email: 'shivani.tibrewala@yahoo.com' },
  { name: 'Narender Gauri', email: 'ng@gauries.com' },
  { name: 'Ramesh Patil', email: 'stellarsrp@gmail.com' },
  { name: 'Deepthi', email: 'deepthi.gunna@gmail.com' },
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