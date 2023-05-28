import jwt from 'jsonwebtoken';

const generateRefreshToken = (email) => {
  return jwt.sign({ email }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
}

export default generateRefreshToken;