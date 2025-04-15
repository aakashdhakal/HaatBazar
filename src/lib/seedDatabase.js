// utils/seedDatabase.js
import mongoose from 'mongoose';
import Product from '../modals/productModal';
import products from './data.json'; // Import data from data.json

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Product.deleteMany();
        await Product.insertMany(products);
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();