import express from "express";
import { authController } from '../controllers/auth.controller';
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

router.route('/register')
    .get(authController.renderRegister)
    .post(catchAsync(authController.register));

router.route('/login',)
    .get(authController.renderLogin)
    .post(catchAsync(authController.login));

router.get('/logout', catchAsync(authController.logout));

export default router;