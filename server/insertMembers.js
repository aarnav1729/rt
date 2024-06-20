const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Member = require('./models/Member');

dotenv.config();

const members = [
  { name: 'Achala Kumar', email: 'KUMARACHALA@HOTMAIL.COM' },
  { name: 'Amit Sanghi', email: 'mitsanghi2013@gmail.com' },
  { name: 'Ananth Rao', email: 'araomobile@yahoo.com' },
  { name: 'Anurag Sharma', email: 'anuragsharmaips17@gmail.com' },
  { name: 'Bhawant Anand', email: 'bhawantanand@gmail.com' },
  { name: 'Brijesh Chandwani', email: 'brijesh@keus.in' },
  { name: 'Chiranjeev Saluja', email: 'saluja@premierenergies.com' },
  { name: 'Dr Tanuja Khurana', email: 'drtanuja.diet@gmail.com' },
  { name: 'Dr Vinayak Pampati', email: 'vkpampati@gmail.com' },
  { name: 'Girish Gelli', email: 'GGELLI@GMAIL.COM' },
  { name: 'Gulab Shrimal', email: 'shrimalgulab@gmail.com' },
  { name: 'Jeny Gupta', email: 'JENYGUPTA@HOTMAIL.COM' },
  { name: 'Tarun Gupta', email: 'orion.tarun@gmail.com' },
  { name: 'Nagesh Boorugu', email: 'sarikaboorugu@gmail.co' },
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
  { name: 'Sanjay Jain DeenDayal', email: 'SANJAY@AV-VISIONINDIA.CO.IN' },
  { name: 'Sanjeev Singh', email: 'sanjre@hotmail.com' },
  { name: 'Shyam Pal Reddy', email: 'shyam@palreddy.in' },
  { name: 'Sri Nagesh Boorugu', email: 'sarikaboorugu@gmail.co' },
  { name: 'Sridhar Lagadapati', email: 'sridhar.lagadapati@gmail.com' },
  { name: 'Suneel Vadlamudi', email: 'SUNEELV@GMAIL.COM' },
  { name: 'Sunil Saraf', email: 'sunilsarafhyd@gmail.com' },
  { name: 'Sunita G Kumar', email: 'CMD@MAAENT.COM' },
  { name: 'Sushil Goenka', email: 'sushil@fff.co.in' },
  { name: 'Uday Pilani', email: 'udaypilani@gmail.com' },
  { name: 'Veer Prakash', email: 'veeru.op@gmail.com' },
  { name: 'Vijay Vishal Reddy', email: 'vijay.vishal@gmail.com' },
  { name: 'Anju Chandwani', email: 'brijesh@keus.in' },
  { name: 'Yashwant Jhabakh', email: 'yashwant@mahavirhyd.com' },
  { name: 'Dimple Agarwal', email: 'wellnesslanguage@gmail.com' },
  { name: 'Shiwani Tibrewala', email: 'shivani.tibrewala@yahoo.com' },
  { name: 'Narender Gauri', email: 'ng@gauries.com' },
  { name: 'Ramesh Patil', email: 'stellarsrp@gmail.com' },
  { name: 'Deepthi', email: 'deepthi.gunna@gmail.com' },
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