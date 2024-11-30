import { createServer } from 'http';
import app from './app.js';
import db from './config/db.js';

const PORT = process.env.PORT  || 8000;

const server = createServer(app);

db().then((result)=> server.listen(PORT, ()=> console.log(`Server listening on port ${ PORT }`)))
.catch((err)=> console.log(err))