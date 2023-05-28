import jwt from 'jsonwebtoken';

const generateAccessToken = (email) => {
  return jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: 60 * 30 });
}

export default generateAccessToken;