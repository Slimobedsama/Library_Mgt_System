import express from 'express';
const app = express();
import dotenv from 'dotenv'
dotenv.config();
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import adminRouter from './routes/adminRoute.js';
import librarianRouter from './routes/librarianRoute.js';
import userRouter from './routes/userRoute.js';
import bookRouter from './routes/bookRoute.js';
import orderRouter from './routes/orderRoute.js';

// JSON PARSER MIDDLEWARE
app.use(express.json());
// ENCODED URL PARSER MIDDLEWARE
app.use(express.urlencoded({extended: true}));
// COOKIE MIDDLEWARE
app.use(cookieParser());
// MORGAN MIDDLEWARE
app.use(morgan('dev'));
// ROUTES MIDDLEWARES
app.use('/api/admins', adminRouter);
app.use('/api/librarians', librarianRouter);
app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/orders', orderRouter);

export default app;