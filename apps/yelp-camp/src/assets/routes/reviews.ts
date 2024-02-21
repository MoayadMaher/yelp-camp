import express from "express";
import { PrismaClient } from "@prisma/client";
import { ExpressError } from "../utils/ExpressError";
import { catchAsync } from "../utils/catchAsync";
import { validateReview } from "../utils/validateCampground";
import Review from "../controllers/reviews.controller";
import { isLogedin } from "../middlewares/isLogedin";
import { isReviewAuthor } from "../middlewares/isReviewAuthor";

const prisma = new PrismaClient();
const { createReview, deleteReview } = Review;

const router = express.Router({ mergeParams: true });

router.post('/', isLogedin, validateReview, catchAsync(createReview));

router.delete('/:reviewId', isLogedin, isReviewAuthor, catchAsync(deleteReview));

export default router;

