import { Router } from "express";
const router = Router();
import Chapter from "../../models/Chapter.js";
import catchValidationError from "../../helper/catchValidationError.js";
import mongoose from "mongoose";
import Image from "../../models/Image.js";

// const ROUTE_PATH = '/api/comics/:comicId/chapter';
const ROUTE_PATH = '';

router.post(`${ROUTE_PATH}/generate`, async (req, res) => {
  try {
    const comicId = req.params.comicId ?? res.locals.comicId;

    if (!Array.isArray(req.body)) {
      const chapterCheck = await Chapter.findOneAndRemove({ comicId, index: req.body.index });
      if (chapterCheck) return res.status(400).send({ message: 'Duplicated index' });
    }

    const chapters = (!Array.isArray(req.body)) ? [req.body] : req.body;
    let newChapters = chapters.map((chapter) => {
      return {
        _id: new mongoose.Types.ObjectId(),
        comicId,
        index: chapter.index,
        title: chapter.title,
        images: Array.isArray(chapter.images) ? chapter.images : null,
      }
    });

    let newImages = [];
    newChapters.forEach((chapter) => {
      chapter?.images?.forEach((images) => {
        images.image_data.forEach((image) => {
          console.log(image);
          newImages.push({
            lang: images.lang,
            chapterId: chapter._id,
            index: image.index,
            image_url: image.image_url,
          })
        })
      })
    })

    await Chapter.deleteMany({
      comicId,
      index: {
        "$in": newChapters.map((chapter) => chapter.index),
      }
    });
    await Chapter.create(newChapters);
    const chapterList = await Chapter.find({ comicId }).sort({ index: 1 })

    await Image.deleteMany({
      lang: {
        "$in": newImages.map((image) => image.lang),
      },
      chapterId: {
        "$in": newImages.map((image) => image.chapterId),
      }
    });
    await Image.create(newImages);

    res.send(chapterList);
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).send({ message: 'Not Found' });
    const validationError = catchValidationError(error);
    if (validationError) return res.status(validationError.statusCode).send(validationError.errors);
    return res.status(500).json({ message: error.message });
  }
});

router.put(`${ROUTE_PATH}/:id/update`, async (req, res) => {
  try {
    const comicId = req.params.comicId ?? res.locals.comicId;
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, {
      comicId,
      index: req.body.index,
      title: req.body.title,
    }, { new: true, runValidators: true });
    if (!chapter) {
      return res.status(404).send({ message: 'Not Found' });
    }
    return res.send(chapter);
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).send({ message: 'Not Found' });
    const validationError = catchValidationError(error);
    if (validationError) return res.status(validationError.statusCode).send(validationError.errors);
    return res.status(400).json({ message: error.message });
  }
})

router.delete(`${ROUTE_PATH}/:id/delete`, async (req, res) => {
  try {
    await Chapter.findByIdAndRemove(req.params.id);
    return res.send({ message: 'OK' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).send({ message: 'Not Found' });
    }
    const validationError = catchValidationError(error);
    if (validationError) return res.status(validationError.statusCode).send(validationError.errors);
    return res.status(400).json({ message: error.message });
  }
})

router.get(`${ROUTE_PATH}/all`, async (req, res) => {
  try {
    const comicId = req.params.comicId ?? res.locals.comicId;
    const index = req.query.index ?? 1;
    const chapters = await Chapter.find({ comicId }).sort({ index });
    res.send(chapters);
  } catch (error) {
    const validationError = catchValidationError(error);
    if (validationError) res.status(validationError.statusCode).send(validationError.errors);
    else res.status(400).json({ message: error.message });
  }
})

router.get(`${ROUTE_PATH}/:id`, async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    res.send(chapter);
  } catch (error) {
    if (error.name === 'CastError') res.status(404).send({ message: 'Not Found' });
    else res.status(400).json({ message: error.message });
  }
})

router.get(`${ROUTE_PATH}/:id/prevnext`, async (req, res) => {
  try {
    const comicId = req.params.comicId ?? res.locals.comicId;
    const chapter = await Chapter.findById(req.params.id);
    const prev = await Chapter.findOne({ comicId, index: chapter.index - 1 });
    const next = await Chapter.findOne({ comicId, index: chapter.index + 1 });
    res.send({
      prev,
      next,
    });
  } catch (error) {
    if (error.name === 'CastError') res.status(404).send({ message: 'Not Found' });
    else res.status(400).json({ message: error.message });
  }
})

export default router;