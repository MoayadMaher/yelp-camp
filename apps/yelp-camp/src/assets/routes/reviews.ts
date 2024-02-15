import  express  from "express";
import { PrismaClient } from "@prisma/client";
import { ExpressError } from "../utils/ExpressError";
import { catchAsync } from "../utils/catchAsync";
import { validateReview } from "../utils/validateCampground";

const prisma = new PrismaClient();

const router = express.Router({mergeParams:true});

router.post('/', validateReview, catchAsync(async(req, res) => {
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
  req.flash('success', 'Created new review!');
  res.redirect(`/campgrounds/${campground.id}`);
}));

router.delete('/:reviewId', catchAsync(async (req,res)=>{
  await prisma.review.delete({
    where:{
      id : req.params.reviewId
    }
  })
  req.flash('success', 'Successfully deleted review');
  res.redirect(`/campgrounds/${req.params.id}`);
}));

export default router;

