
const seedDatabase = async () => {
  try {
    console.log('Seeding Airports...');
    // await seedAirports();

    console.log('Seeding Airlines...');
    // await seedAirlines();

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    process.exit(0);
  }
};

export default seedDatabase;
