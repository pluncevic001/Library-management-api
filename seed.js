require('dotenv').config();
const { connectDB } = require('./src/config/database');
const seedDatabase = require('./src/config/seed');

const runSeed = async () => {
    try {
        await connectDB();
        await seedDatabase();
        process.exit(0);
    } catch (error) {
        console.error('Error running seed:', error);
        process.exit(1);
    }
};

runSeed();