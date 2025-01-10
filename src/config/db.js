import mongoose from 'mongoose';
import logger from '../logger.js';

const db = async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        logger.info('DATABASE CONNECTED...');
    } catch (error) {
        logger.error(error.message);
    }
}

export default db;