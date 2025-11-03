const axios = require('axios');
const config = require('../config/config');

exports.validateRPPS = async (rppsNumber) => {
  try {
    const response = await axios.get(`https://api.rpps.example.com/validate?rpps=${rppsNumber}&key=${config.RPPS_API_KEY}`);
    return response.data.valid;
  } catch (error) {
    console.error('RPPS validation error:', error);
    return false;
  }
};
