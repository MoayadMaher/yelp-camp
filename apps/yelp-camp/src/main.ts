/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import express from 'express';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import morgan from 'morgan';
import { ExpressError } from './assets/utils/ExpressError';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import authRoutes from './assets/routes/auth';
import campgroundRoutes from './assets/routes/campground';
import reviewsRoutes from './assets/routes/reviews';

const prisma = new PrismaClient();

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'assets/views'));
app.use(express.static(path.join(__dirname, 'assets/public')));
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.cookies.userID;
  res.locals.success = (req as any).flash('success');
  res.locals.error = (req as any).flash('error');
  next();
});

app.use('/auth', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('', (req, res) => {
  res.redirect('/campgrounds');
});

// if no path matches, send 404 error message. (last thing to call)
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
