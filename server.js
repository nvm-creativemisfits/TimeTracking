const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Endpoint to handle Trello API requests
app.post('/trello/comment', async (req, res) => {
  const { cardId, comment } = req.body;

  try {
    const response = await axios.post(
      `https://api.trello.com/1/cards/${cardId}/actions/comments`,
      { text: comment },
      {
        params: {
          key: process.env.TRELLO_API_KEY,
          token: process.env.TRELLO_API_TOKEN,
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error posting comment to Trello:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to send data to Google Sheets
app.post('/google/sheets', async (req, res) => {
  const { payload } = req.body;

  try {
    const response = await axios.post(
      process.env.GOOGLE_SHEETS_WEBHOOK_URL,
      payload
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error sending data to Google Sheets:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
