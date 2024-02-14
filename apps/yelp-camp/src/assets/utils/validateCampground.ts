import Joi from "joi";
import { ExpressError } from "./ExpressError";

const validateCampground = (req, res ,next) => {
    const campgroundSchema = Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0)
  }).required();

  const {error} = campgroundSchema.validate(req.body.campground);
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else{
    next();
  };
};


const validateReview = (req, res ,next) => {
    const reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required()
  }).required();

  const {error} = reviewSchema.validate(req.body.review);
  if(error){
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(msg, 400);
  } else{
    next();
  };  
};

export { validateCampground, validateReview };