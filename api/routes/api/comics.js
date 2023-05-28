import { Router } from "express";
const router = Router();
import Comic from "../../models/Comic.js";
import catchValidationError from "../../helper/catchValidationError.js";

// const ROUTE_PATH = '/api/comics';
const ROUTE_PATH = '';

router.post(`${ROUTE_PATH}/create`, async (req, res) => {
  try {
    const comic = await Comic.create({
      title: req.body.title,
      author: req.body.author,
      desc: req.body.desc,
      thumb_url: req.body.thumb_url,
    })
    return res.send(comic);
  } catch (error) {
    const validationError = catchValidationError(error);
    if (validationError) return res.status(validationError.statusCode).send(validationError.errors);
    return res.status(500).json({ message: error.message });
  }
});

router.put(`${ROUTE_PATH}/:id/update`, async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) throw new Error('Please provide necessary resources');
    const comic = await Comic.findByIdAndUpdate(req.params.id, {
      title: req.body.title || null,
      author: req.body.author,
      desc: req.body.desc,
      thumb_url: req.body.thumb_url,
    }, { new: true, runValidators: true });
    if (!comic) {
      return res.status(404).send({ message: 'Not Found' });
    }
    res.send(comic);
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).send({ message: 'Not Found' });
    const validationError = catchValidationError(error);
    if (validationError) return res.status(validationError.statusCode).send(validationError.errors);
    return res.status(400).json({ message: error.message });
  }
})

router.delete(`${ROUTE_PATH}/:id/delete`, async (req, res) => {
  try {
    await Comic.findByIdAndRemove(req.params.id);
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
    const comics = await Comic.find({});
    return res.send(comics);
  } catch (error) {
    const validationError = catchValidationError(error);
    if (validationError) return res.status(validationError.statusCode).send(validationError.errors);
    return res.status(400).json({ message: error.message });
  }
})

router.get(`${ROUTE_PATH}/:id`, async (req, res) => {
  try {
    const comic = await Comic.findById(req.params.id);
    return res.send(comic);
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).send({ message: 'Not Found' });
    return res.status(400).json({ message: error.message });
  }
})

router.get('/test/test1/test2', (req, res) => {
  return res.send({
    message: 'Go Test!',
  });
})

export default router;