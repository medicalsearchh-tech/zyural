const axios = require('axios');

const sendWhatsAppMessage = async (chatId, text) => {
  const url = "http://95.217.67.199:3000/api/sendText";
  const body = {
    chatId: `${chatId}@c.us`,
    text: text,
    session: "default"
  };

  try {
    const response = await axios.post(url, body, {
      headers: {
        "Content-type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error sending WhatsApp message: ${error}`);
    return { success: false, error: error.message };
  }
};

module.exports = sendWhatsAppMessage;
