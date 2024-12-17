const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
    console.error('Error posting to Trello:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
