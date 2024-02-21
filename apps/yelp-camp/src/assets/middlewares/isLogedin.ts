import jwt from 'jsonwebtoken';

require('dotenv').config()
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

export const isLogedin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in');
        res.status(401).redirect('/auth/login');
    }

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            req.session.returnTo = req.originalUrl
            req.flash('error', 'You must be logged in');
            res.status(403).redirect('/auth/login');
        }
        req.user = user;
        next();
    });
};


