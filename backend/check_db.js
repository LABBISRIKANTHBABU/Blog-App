
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const check = async () => {
    console.log("Attempting to connect to:", process.env.DB);
    try {
        await mongoose.connect(process.env.DB);
        console.log('Database connected successfully');
        process.exit(0);
    } catch (error) {
        console.log('DB connection failed');
        console.error(error);
        process.exit(1);
    }
};

check();
