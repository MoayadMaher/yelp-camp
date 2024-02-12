/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { PrismaClient } from '@prisma/client'

import {seedDB} from './models/seeds/index'

const prisma = new PrismaClient();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'assets/views'));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('', (req, res) => {
  res.render('home.ejs');
});

app.get('/seedDB', async (req, res) => {
  seedDB().catch(console.error);
  res.send("seeds sucssfuly")
});

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
