const Event = require('../models/Event');

const seedEvents = async () => {
  const events = [
    { name: 'Induction', date: new Date('2024-06-30'), latitude: 17.432178, longitude: 78.384995 },
    { name: 'Meeting 2', date: new Date('2024-07-12'), latitude: 17.432178, longitude: 78.384995},
  ];

  try {
    await Event.insertMany(events);
    console.log('Events seeded');
  } catch (error) {
    console.error('Error seeding events:', error);
  }
};

module.exports = { seedEvents };