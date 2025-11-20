import express from 'express';
const app = express();
import dotenv from 'dotenv'
dotenv.config();
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import livereload from "livereload";
import connectLiveReload  from "connect-livereload";
import session from 'express-session';
import flash from 'connect-flash';
import logger from './logger.js';
import adminRouter from './services/admin/routes/admin.js';
import librarianRouter from './services/librarian/routes/librarian.js';
import userRouter from './services/user/routes/user.js';
import bookRouter from './services/book/routes/book.js';
import orderRouter from './services/order/routes/order.js';
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
// LIVE RELOAD MIDDLEWARE
if (process.env.NODE_ENV !== 'production') {
  const liveReloadServer = livereload.createServer();

  // Tell livereload which directory to watchout for
  liveReloadServer.watch([
    join(__dirname, 'views'),
    join(__dirname, 'public')
  ]);
  
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
  
  app.use(connectLiveReload());
}
// COOKIE MIDDLEWARE
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 120000 },
  })
);
app.use(flash());

// MAKE FLASH AVAILABLE IN ALL VIEWS
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
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