const express = require('express');
const cors = require('cors'); // CORS middleware
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

// Middleware setup
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parses JSON bodies

// Default GET route for server root
app.get('/', (req, res) => {
  res.send('Time Tracking Power-Up Server is running.');
});

// GET route for popup content
app.get('/popup', (req, res) => {
  res.send(`
    <html>
      <head><title>Log Time Comment</title></head>
      <body>
        <form id="comment-form">
          <label for="comment">Enter comment:</label>
          <input type="text" id="comment" name="comment" required />
          <button type="submit">Submit</button>
        </form>
        <script>
          document.getElementById('comment-form').onsubmit = async (e) => {
            e.preventDefault();
            const comment = document.getElementById('comment').value;
            const cardId = 'YOUR_CARD_ID'; // Replace dynamically if needed
            try {
              await fetch('/trello/comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardId, comment }),
              });
              alert('Comment submitted successfully');
            } catch (error) {
              alert('Error submitting comment: ' + error.message);
            }
          };
        </script>
      </body>
    </html>
  `);
});

// POST route to add comments to Trello
app.post('/trello/comment', async (req, res) => {
  const { cardId, comment } = req.body;

  try {
    const response = await axios.post(
      `https://api.trello.com/1/cards/${cardId}/actions/comments`,
      { text: comment },
      {
        params: {
          key: process.env.TRELLO_API_KEY, // API Key from Render environment
          token: process.env.TRELLO_API_TOKEN, // API Token from Render environment
        },
      }
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error posting to Trello:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
