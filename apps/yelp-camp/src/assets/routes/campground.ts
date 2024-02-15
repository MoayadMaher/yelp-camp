import  express  from "express";
import { PrismaClient } from "@prisma/client";
import { ExpressError } from "../utils/ExpressError";
import { catchAsync } from "../utils/catchAsync";
import { validateCampground } from "../utils/validateCampground";


const prisma = new PrismaClient();

const router = express.Router();

router.get('/', catchAsync( async (req, res) => {
  const campgrounds = await prisma.campground.findMany();

  res.render('campgrounds/index', {campgrounds});
}));

router.get('/new', (req, res) => {
  res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync( async(req, res) => {
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
  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${newCampground.id}`);
}));

router.get('/:id', catchAsync(async(req, res) => {
  const campground = await prisma.campground.findUnique({
    where:{
      id: (req.params.id)
    },
    include:{
      reviews:true
    }
  })
  if(!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds'); 
  };
  res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
  const campground = await prisma.campground.findUnique({
    where:{
      id: (req.params.id)
    }
  })
  if(!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds'); 
  };
  res.render('campgrounds/edit', {campground});
}));

router.put('/:id', validateCampground, catchAsync(async(req, res) => {
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
  req.flash('success', 'Successfully updated campground!');
  res.redirect(`/campgrounds/${campground.id}`);
}));

router.delete('/:id', catchAsync(async(req, res) => {
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

  res.flash('success', 'Successfully deleted campground!');
  res.redirect('/campgrounds');
}));

export default router; 
