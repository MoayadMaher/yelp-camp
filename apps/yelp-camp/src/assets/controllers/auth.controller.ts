import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';


dotenv.config();
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

const prisma = new PrismaClient();

export class authController {

    static async register(req, res) {
        try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                },
            });
            const token = jwt.sign({ userId: newUser.id }, accessTokenSecret, { expiresIn: '5h' });

            req.flash('success', 'Account created successfully');
            res.cookie('token', token, { httpOnly: true })
            res.cookie('userID', newUser.id, { httpOnly: true });
            res.redirect('/campgrounds');
        }
        catch (e) {
            req.flash('error', e.message);
            res.redirect('/auth/register');
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (!user) {
                throw new Error("Incorect user or password")
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new Error("Incorect user or password")
            }
            const token = jwt.sign({ userId: user.id }, accessTokenSecret, { expiresIn: '5h' });

            const redirectUrl = req.session.returnTo || '/campgrounds'
            delete req.session.returnTo;

            req.flash('success', 'Welcome back!');
            res.cookie('token', token, { httpOnly: true })
            res.cookie('userID', user.id, { httpOnly: true });
            res.redirect(redirectUrl);

        } catch (e) {
            req.flash('error', `Can\'t login ,${e.message}`)
            res.redirect('/auth/login');
        }
    }

    static async logout(req, res) {
        req.flash('success', "Goodbye!");
        res.clearCookie('token');
        res.clearCookie('userID');
        res.redirect('/campgrounds');
    }

    static renderRegister(req, res) {
        res.render('auth/register');
    }

    static renderLogin(req, res) {
        res.render('auth/login');
    }
}
