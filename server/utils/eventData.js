// eventData.js
const Event = require('../models/Event');

const seedEvents = async () => {
  const events = [
    { name: 'Induction', date: new Date('2024-06-30'), latitude: 17.432178, longitude: 78.384995 },
    { name: 'Demo', date: new Date('2024-08-31'), latitude: 17.432178, longitude: 78.384995 },
    { name: 'Meeting 1', date: new Date('2024-09-17'), latitude: 17.432178, longitude: 78.384995 },
  ];

  try {
    // Remove all existing events
    const deleteResult = await Event.deleteMany({});
    console.log(`Existing events cleared: ${deleteResult.deletedCount} events removed.`);

    // Seed new events
    const insertedEvents = await Event.insertMany(events);
    console.log(`${insertedEvents.length} events seeded successfully.`);
  } catch (error) {
    console.error('Error seeding events:', error);
  }
};

module.exports = { seedEvents };