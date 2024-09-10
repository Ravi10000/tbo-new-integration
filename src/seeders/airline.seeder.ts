import Airline from '../models/airline.model';

export const seedAirlines = async () => {
  try {
    // Check if there are existing airlines in the database
    const existingAirlines = await Airline.countDocuments();

    if (existingAirlines > 0) {
      console.log('Airlines data already exists. Skipping seeding.');
      return;
    }

    // Sample data to seed
    const airlines = [
      {
        airlineCode: 'AA',
        airlineName: 'American Airlines',
        isLowCostCarrier: false,
        allianceCode: 'Oneworld',
        customerCareNumber: '+1-800-433-7300',
      },
      {
        airlineCode: 'RYR',
        airlineName: 'Ryanair',
        isLowCostCarrier: true,
        allianceCode: null,
        customerCareNumber: '+44-871-246-0000',
      },
      {
        airlineCode: 'DL',
        airlineName: 'Delta Airlines',
        isLowCostCarrier: false,
        allianceCode: 'SkyTeam',
        customerCareNumber: '+1-800-221-1212',
      },
      // Add more sample data as needed
    ];

    // Insert sample data
    await Airline.insertMany(airlines);
    console.log('Airlines seeded successfully');
  } catch (error) {
    console.error('Failed to seed airlines:', error);
  }
};
