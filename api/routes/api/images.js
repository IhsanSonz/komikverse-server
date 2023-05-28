import { Router } from "express";
const router = Router();
import Image from "../../models/Image.js";
import catchValidationError from "../../helper/catchValidationError.js";

// const ROUTE_PATH = '/api/comics/:comicId/chapter/:chapterId/image';
const ROUTE_PATH = '';

router.post(`${ROUTE_PATH}/generate`, async (req, res) => {
  try {
    const chapterId = req.params.chapterId;
    const { lang, image_data } = req.body;

    if (!Array.isArray(image_data)) {
      const imageCheck = await Image.findOneAndRemove({ chapterId, lang, index: image_data.index });
      if (imageCheck) return res.status(400).send({ message: 'Duplicated index and lang' });
    }

    const images = (!Array.isArray(image_data)) ? [image_data] : image_data;
    let newImages = images.map((image) => {
      return {
        lang,
        chapterId,
        index: image.index,
        image_url: image.image_url,
      }
    });

    await Image.deleteMany({
      chapterId,
      lang,
      index: {
        "$in": newImages.map((image) => image.index),
      }
    });
    await Image.create(newImages);
    const chapterList = await Image.find({ chapterId }).sort({ lang: 1, index: 1 })
    console.log(chapterId, chapterList);
    res.send(chapterList);
  } catch (error) {
    console.error(error);
    if (error.name === 'CastError') return res.status(404).send({ message: 'Not Found' });
    const validationError = catchValidationError(error);
    if (validationError) return res.status(validationError.statusCode).send(validationError.errors);
    return res.status(500).json({ message: error.message });
  }
});

router.put(`${ROUTE_PATH}/:id/update`, async (req, res) => {
  try {
    const chapterId = req.params.chapterId;
    const { lang, index, image_url } = req.body
    const image = await Image.findByIdAndUpdate(req.params.id, {
      chapterId,
      lang,
      index,
      image_url,
    }, { new: true, runValidators: true });
    if (!image) {
      return res.status(404).send({ message: 'Not Found' });
    }
    return res.send(image);
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).send({ message: 'Not Found' });
    const validationError = catchValidationError(error);
    if (validationError) return res.status(validationError.statusCode).send(validationError.errors);
    return res.status(400).json({ message: error.message });
  }
})

router.delete(`${ROUTE_PATH}/:id/delete`, async (req, res) => {
  try {
    await Image.findByIdAndRemove(req.params.id);
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

router.get(`${ROUTE_PATH}/:lang/all`, async (req, res) => {
  try {
    const chapterId = req.params.chapterId;
    const lang = req.params.lang;
    const images = await Image.find({ chapterId, lang }).sort({ index: 1 });
    res.send(images);
  } catch (error) {
    const validationError = catchValidationError(error);
    if (validationError) res.status(validationError.statusCode).send(validationError.errors);
    else res.status(400).json({ message: error.message });
  }
})

router.get(`${ROUTE_PATH}/:id`, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    res.send(image);
  } catch (error) {
    if (error.name === 'CastError') res.status(404).send({ message: 'Not Found' });
    else res.status(400).json({ message: error.message });
  }
})

export default router;