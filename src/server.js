import { createServer } from 'http';
import app from './app.js';
import db from './config/db.js';
import logger from './logger.js';

const PORT = process.env.PORT  || 8000;

const server = createServer(app);

db().then((result)=> server.listen(PORT, '0.0.0.0', ()=> logger.info(`Server listening on port ${ PORT }`))) 
.catch((err)=> logger.error(err))