const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/trello/comment', async (req, res) => {
  const { cardId, comment } = req.body;

  const apiKey = process.env.TRELLO_API_KEY;
  const apiToken = process.env.TRELLO_API_TOKEN;

  if (!apiKey || !apiToken) {
    return res.status(500).json({ error: 'Trello API credentials are missing.' });
  }

  const url = `https://api.trello.com/1/cards/${cardId}/actions/comments?key=${apiKey}&token=${apiToken}&text=${encodeURIComponent(comment)}`;

  try {
    const response = await fetch(url, { method: 'POST' });
    if (!response.ok) {
      throw new Error(`Trello API responded with status ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error posting comment to Trello:', error);
    res.status(500).json({ error: 'Failed to post comment to Trello.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
