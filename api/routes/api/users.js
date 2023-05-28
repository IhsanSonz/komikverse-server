import { Router } from "express";
const router = Router();
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import validateRegisterInput from "../../validation/users/register.js";
import validateLoginInput from "../../validation/users/login.js";
import generateAccessToken from "../../helper/generateAccessToken.js";
import generateRefreshToken from "../../helper/generateRefreshToken.js";
import authenticateToken from "../../helper/authenticateToken.js";
const { hash, genSalt } = bcrypt;

const ROUTE_PATH = '/api/users';

router.post(`${ROUTE_PATH}/register`, (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({ 'email': 'Alamat email sudah digunakan' });
      } else {
        const accessToken = generateAccessToken(req.body.email);
        const refreshToken = generateRefreshToken(req.body.email);
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          refreshToken,
        });
        genSalt(10, (err, salt) => {
          hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json({ ...user.toObject(), accessToken }))
              .catch(err => res.status(500).send({ message: 'Internal server error' }))
          })
        });
      }
    })
});

router.post(`${ROUTE_PATH}/login`, (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(400).json({
          message: 'Data login tidak ditemukan',
        });
      }
      const accessToken = generateAccessToken(user.email);
      const refreshToken = generateRefreshToken(user.email);
      user.refreshToken = refreshToken;
      user.save();
      return res.json({ ...user.toObject(), accessToken });
    });
})

router.post(`${ROUTE_PATH}/logout`, authenticateToken, async (req, res) => {
  try {
    console.log(req.user.email);
    const user = await User.findOneAndUpdate({ email: req.user.email }, {
      refreshToken: null,
    }, { new: true, });
    if (!user) {
      return res.status(400).json({
        message: 'Data login tidak ditemukan',
      });
    }
    return res.send({ message: 'OK' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
})

router.get(`${ROUTE_PATH}/all`, (req, res) => {
  User.find({}).then((err, users) => {
    if (err) {
      return res.send(err);
    } else {
      return res.send(JSON.stringify(users));
    }
  });
})

export default router;