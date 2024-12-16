const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Endpoint to post a comment to Trello securely
app.post('/trello/comment', async (req, res) => {
  const { cardId, comment } = req.body;

  try {
    const response = await axios.post(
      `https://api.trello.com/1/cards/${cardId}/actions/comments`,
      { text: comment },
      {
        params: {
          key: process.env.TRELLO_API_KEY, // Render injects this
          token: process.env.TRELLO_API_TOKEN, // Render injects this
        },
      }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error posting to Trello:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to send data to Google Sheets
app.post('/google/sheets', async (req, res) => {
  const payload = req.body;

  try {
    const response = await axios.post(
      process.env.GOOGLE_SHEETS_WEBHOOK_URL,
      payload
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error sending to Google Sheets:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
