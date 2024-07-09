const Event = require('../models/Event');

const seedEvents = async () => {
  const events = [
    { name: 'Induction', date: new Date('2024-06-30'), latitude: 17.432178, longitude: 78.384995 },
    { name: 'Demo', date: new Date('2024-07-09'), latitude: 17.434546750377216, longitude: 78.37660586747836 },
    { name: 'Meeting 2', date: new Date('2024-07-12'), latitude: 51.5074, longitude: -0.1278 },
  ];

  try {
    await Event.insertMany(events);
    console.log('Events seeded');
  } catch (error) {
    console.error('Error seeding events:', error);
  }
};

module.exports = { seedEvents };