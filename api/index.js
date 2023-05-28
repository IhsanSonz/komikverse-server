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

export default function api(functionName) {

  dotenv.config();

  connect(process.env.MONGO_URI)
    .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

  app.use(urlencoded({ extended: false }));
  app.use(json());
  app.use(cors());

  // Set router base path for local dev
  // const ENDPOINT = process.env.NODE_ENV === 'dev' ? `/${functionName}` : `/.netlify/functions/${functionName}/`
  const ENDPOINT = '/';

  //routes
  // app.use(express.static('public'))
  // app.use(ENDPOINT, users);
  // app.use(ENDPOINT, comics);
  // app.use(ENDPOINT, chapters);
  // app.use(ENDPOINT, images);
  app.use('/api/users', users);
  app.use('/api/comics', comics);
  app.use('/api/comics/:comicId/chapters', chapters);
  app.use('/api/comics/:comicId/chapters/:chapterId/images', images);
  app.get('/', (req, res) => {
    return res.send({
      message: 'Go Serverless v3.0! Your function executed successfully!',
    });
  })

  return app

}