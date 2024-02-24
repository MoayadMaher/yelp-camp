import express from 'express';
import { catchAsync } from '../utils/catchAsync';
import { validateCampground } from '../utils/validateCampground';
import Campgrounds from '../controllers/campgrounds.controller';
import { isLogedin } from '../middlewares/isLogedin';
import { isAuthor } from '../middlewares/isAuthor';
import multer from 'multer';
import { storage } from '../cloudinary';

const upload = multer({ storage });

const router = express.Router();

router
  .route('/')
  .get(catchAsync(Campgrounds.index))
  .post(
    isLogedin,
    upload.array('image'),
    validateCampground,
    catchAsync(Campgrounds.craeateCampground)
  );

router.get('/new', isLogedin, Campgrounds.renderNewForm);

router.get(
  '/:id/edit',
  isLogedin,
  isAuthor,
  catchAsync(Campgrounds.renderEditForm)
);

router
  .route('/:id')
  .get(catchAsync(Campgrounds.showCampground))
  .put(
    validateCampground,
    isLogedin,
    isAuthor,
    catchAsync(Campgrounds.updateCampground)
  )
  .delete(isLogedin, isAuthor, catchAsync(Campgrounds.deleteCampground));

export default router;
