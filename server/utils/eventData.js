const Event = require('../models/Event');

const seedEvents = async () => {
  const events = [
    { name: 'Induction', date: new Date('2024-06-30') },
    { name: 'Annual Gala', date: new Date('2024-07-15') },
    { name: 'Community Service', date: new Date('2024-07-30') },
  ];

  try {
    await Event.insertMany(events);
    console.log('Events seeded');
  } catch (error) {
    console.error('Error seeding events:', error);
  }
};

module.exports = { seedEvents };