import express from "express";
import { connect } from "mongoose";
import bodyParser from "body-parser";
const { urlencoded, json } = bodyParser;
const app = express();
import dotenv from "dotenv";
import cors from "cors";

import users from "./routes/api/users.js";
import comics from "./routes/api/comics.js";
import chapters from "./routes/api/chapters.js";
import images from "./routes/api/images.js";

export default function api() {

  dotenv.config();

  connect(process.env.MONGO_URI)
    .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(cors());

  app.use('/api/users', users);
  app.use('/api/comics', comics);
  app.use('/api/comics/:comicId/chapters', (req, res, next) => {
    res.locals.comicId = req.params.comicId;
    next();
  }, chapters);
  app.use('/api/comics/:comicId/chapters/:chapterId/images', (req, res, next) => {
    res.locals.comicId = req.params.comicId;
    res.locals.chapterId = req.params.chapterId;
    next();
  }, images);
  app.get('/', (req, res) => {
    return res.send({
      message: 'Go Serverless v3.0! Your function executed successfully!',
    });
  })

  return app

}