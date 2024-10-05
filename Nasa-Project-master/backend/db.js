// db.js
const mongoose = require('mongoose');

const uri = 'mongodb+srv://yarae7371:mongo_1234@cluster0.v5ie6.mongodb.net/earth';

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB; // This should work correctly