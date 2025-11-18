import mongoose from 'mongoose';
import "dotenv/config";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        return true;
    } catch (error) {
        return `MongoDB connection error: ${error}`;
    }
}

export default connectDB;