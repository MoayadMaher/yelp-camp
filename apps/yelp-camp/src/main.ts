/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import morgan from 'morgan';
import { catchAsync } from './assets/utils/catchAsync';
import { ExpressError } from './assets/utils/ExpressError';
import { validateCampground, validateReview } from './assets/utils/validateCampground';
// import {seedDB} from './models/seeds/index'

const prisma = new PrismaClient();

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'assets/views'));
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(morgan('dev'));

app.get('', (req, res) => {
  res.render('home.ejs');
});

// app.get('/seedDB', async (req, res) => {

//   seedDB().catch(console.error);
//   res.send("seeds sucssfuly")
// });

app.get('/campgrounds', catchAsync( async (req, res) => {
  const campgrounds = await prisma.campground.findMany();

  res.render('campgrounds/index', {campgrounds});
}));

app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, catchAsync( async(req, res) => {
  const campground = req.body.campground;

  const newCampground =await prisma.campground.create({
    data: {
      title: campground.title,
      location: campground.location,
      image: campground.image,
      description: campground.description,
      price: campground.price
    }
  });
  res.redirect(`/campgrounds/${newCampground.id}`);
}));

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
  const campground = await prisma.campground.findUnique({
    where:{
      id: (req.params.id)
    },
    include:{
      reviews:true
    }
  })
  if(!campground) throw new ExpressError('Campground Not Found', 404);
  res.render('campgrounds/show', {campground});
}));

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
  const campground = await prisma.campground.findUnique({
    where:{
      id: (req.params.id)
    }
  })
  res.render('campgrounds/edit', {campground});
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
  const campground = await prisma.campground.update({
    where:{
      id: (req.params.id)
    },
    data: {
      title: req.body.campground.title,
      location: req.body.campground.location,
      image: req.body.campground.image,
      description: req.body.campground.description,
      price: req.body.campground.price
    }
  })
  res.redirect(`/campgrounds/${campground.id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
  await prisma.review.deleteMany({
    where: {
      campgroundId: req.params.id
    }
  });

  await prisma.campground.delete({
    where:{
      id: (req.params.id)
    }
  })

  res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res) => {
  const campground = await prisma.campground.findUnique({
    where:{
      id: req.params.id
    }
  });

  const review = await prisma.review.create({
    data: {
      campgroundId: campground.id,
      rating: req.body.review.rating,
      body: req.body.review.body
    }
  });

  res.redirect(`/campgrounds/${campground.id}`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req,res)=>{
  await prisma.review.delete({
    where:{
      id : req.params.reviewId
    }
  })

  res.redirect(`/campgrounds/${req.params.id}`);
}));

// if no path matches, send 404 error message. (last thing to call)
app.all('*', (req, res, next) => {
  next (new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
});

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
