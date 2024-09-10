import mongoose from "mongoose";

export function connectionMongoDb(MongoUrl: string): Promise<typeof mongoose> {
    return mongoose.connect(MongoUrl)
        .then(() => {
            console.log('Successfully connected to MongoDB.');
            return mongoose;
        })
        .catch((error: Error) => {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        });
}
