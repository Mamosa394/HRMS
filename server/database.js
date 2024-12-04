import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://mamosamotsie:MAMOSAMOTSIE@hr-management.tzqo2.mongodb.net/?retryWrites=true&w=majority&appName=HR-management', {

        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit the process with failure
    }
};

export default connectDB;
