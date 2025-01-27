import express from 'express';
const app = express();
import dotenv from 'dotenv'
dotenv.config();
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import logger from './logger.js';
import adminRouter from './routes/admin.js';
import librarianRouter from './routes/librarian.js';
import userRouter from './routes/user.js';
import bookRouter from './routes/book.js';
import orderRouter from './routes/order.js';
import errorHandler from './middleware/errorHandler.js';

const morganFormat = ":method :url :status :response-time ms";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// JSON PARSER MIDDLEWARE
app.use(express.json());
// ENCODED URL PARSER MIDDLEWARE
app.use(express.urlencoded({extended: true}));
// STATIC MIDDLEWARE
app.use(express.static(join(__dirname, 'public')));
// TEMPLATE ENGINE
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
// COOKIE MIDDLEWARE
app.use(cookieParser());
// MORGAN MIDDLEWARE
app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );
// ROUTES MIDDLEWARES
app.use('/api/admins', adminRouter);
app.use('/api/librarians', librarianRouter);
app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/orders', orderRouter);
app.use(errorHandler);

export default app;