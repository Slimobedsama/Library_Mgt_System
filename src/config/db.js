import mongoose from 'mongoose';
import logger from '../logger.js';

const db = async()=> {
    try {
        await mongoose.connect(process.env.DB_URI);
        logger.info('DATABASE CONNECTED...');
    } catch (error) {
        logger.error(error.message);
    }
}

export default db;