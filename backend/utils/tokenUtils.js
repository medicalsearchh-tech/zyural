const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET);
};

exports.verifyToken = (token) => {
  return jwt.verify(token, config.JWT_SECRET).id;
};

exports.generateOTP = (contact) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Store OTP in a temporary store like Redis with a short TTL
  // For simplicity, this example does not include Redis implementation
  return otp;
};

exports.verifyOTP = (otp) => {
  // Verify OTP from the temporary store
  // For simplicity, this example does not include Redis implementation
  return true;
};