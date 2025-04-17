const { mongoose } = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI
const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error('MongoDB connection string (MONGO_URI) is not defined in environment variables');
        }
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });

        return conn;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = {
    connectDB
}