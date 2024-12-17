const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());

// Restrict CORS to Trello domain for better security
const corsOptions = {
  origin: 'https://trello.com', // Only allow requests from Trello
  optionsSuccessStatus: 200,    // For legacy browser support
};
app.use(cors(corsOptions));

// Use environment variables for sensitive data
const PORT = process.env.PORT || 5000;

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running.');
});

// Endpoint to post a comment to Trello securely
app.post('/trello/comment', async (req, res) => {
  const { cardId, comment } = req.body;

  // Input validation
  if (!cardId || !comment) {
    return res.status(400).json({ success: false, error: 'Missing cardId or comment' });
  }

  try {
    const response = await axios.post(
      `https://api.trello.com/1/cards/${cardId}/actions/comments`,
      { text: comment },
      {
        params: {
          key: process.env.TRELLO_API_KEY,   // Render injects this
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

// Endpoint to send data to Google Sheets securely
app.post('/google/sheets', async (req, res) => {
  const payload = req.body;

  // Input validation: ensure payload exists
  if (!payload) {
    return res.status(400).json({ success: false, error: 'Missing payload' });
  }

  try {
    const response = await axios.post(
      process.env.GOOGLE_SHEETS_WEBHOOK_URL, // Google Sheets Webhook URL
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
