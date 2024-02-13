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
import {seedDB} from './models/seeds/index'

const prisma = new PrismaClient();

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'assets/views'));

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

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await prisma.campground.findMany();

  res.render('campgrounds/index', {campgrounds});
});

app.get('/campgrounds/new', async(req, res) => {
  res.render('campgrounds/new');
});

app.post('/campgrounds', async(req, res) => {
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
});

app.get('/campgrounds/:id', async(req, res) => {
  const campground = await prisma.campground.findUnique({
    where:{
      id: (req.params.id)
    }
  })
  res.render('campgrounds/show', {campground});
});

app.get('/campgrounds/:id/edit', async(req, res) => {
  const campground = await prisma.campground.findUnique({
    where:{
      id: (req.params.id)
    }
  })
  res.render('campgrounds/edit', {campground});
});

app.put('/campgrounds/:id', async(req, res) => {
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
});

app.delete('/campgrounds/:id', async(req, res) => {
  await prisma.campground.delete({
    where:{
      id: (req.params.id)
    }
  })
  res.redirect('/campgrounds');
});

// if no path matches, send 404 error message. (last thing to call)
app.use((req, res) => {
  res.status(404).send('404 NOT FOUND!')
})

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
