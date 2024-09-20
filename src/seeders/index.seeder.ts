import { MongoUrl } from "../config/config";
import { connectionMongoDb } from "../config/connection";
import { countriesAndCitiesSeeder } from "./city.seeder";
import { hotelSeeder } from "./hotel.seeder";

const seedDatabase = async () => {
  try {
    await connectionMongoDb(MongoUrl());

    console.log('Seeding Countries and Cities...');
    await countriesAndCitiesSeeder();

    console.log('Seeding Hotels...');
    await hotelSeeder();

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    process.exit(0);
  }
};

export default seedDatabase;
