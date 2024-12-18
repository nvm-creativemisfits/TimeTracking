const axios = require('axios');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint to handle Trello comment POST
app.post('/trello/comment', async (req, res) => {
  const { cardId, comment } = req.body;

  if (!cardId || !comment) {
    return res.status(400).json({ success: false, error: 'Missing cardId or comment' });
  }

  try {
    // Trello API POST request
    const trelloResponse = await axios.post(
      `https://api.trello.com/1/cards/${cardId}/actions/comments`,
      { text: comment }, // Body data
      {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: process.env.TRELLO_API_KEY,  // Replace with your API key
          token: process.env.TRELLO_API_TOKEN, // Replace with your API token
        },
      }
    );

    res.json({ success: true, data: trelloResponse.data });
  } catch (error) {
    console.error('Error posting to Trello:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
// Default GET route for the root path
app.get('/', (req, res) => {
  res.send('Time Tracking Power-Up Server is running.');
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
