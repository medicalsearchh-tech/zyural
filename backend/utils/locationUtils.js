const axios = require('axios');
const config = require('../config/config');

exports.getAddressDetails = async (address) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${config.GOOGLE_MAPS_API_KEY}`);
    const { results } = response.data;
    const { lat, lng } = results[0].geometry.location;
    const city = results[0].address_components.find(component => component.types.includes('locality')).long_name;
    return { city, latitude: lat, longitude: lng };
  } catch (error) {
    console.error('Error getting address details:', error);
    throw new Error('Address validation failed');
  }
};
