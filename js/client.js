/* global TrelloPowerUp */

// Ensure Trello Power-Up is initialized correctly
const Promise = TrelloPowerUp.Promise;

console.log('Client.js loaded successfully!');

// Replace import with direct constant for environment variable
const ENV = {
  SERVER_URL: 'https://trellotimetracking-backend-server.onrender.com' // Replace with your Render backend URL
};
console.log('Server URL:', ENV.SERVER_URL);

// Initialize Trello Power-Up
TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [{
      icon: 'https://example.com/icon.png', // Replace with your actual icon URL
      text: 'Log Time',
      callback: async function (t) {
        try {
          const card = await t.card('id', 'name');
          const user = await t.member('fullName'); // Get Trello member name

          // Action example: Logged In
          const action = 'Logged In';

          // Log to Trello and Google Sheets
          await postCommentToBackend(card.id, card.name, user.fullName, action);

          t.alert({
            message: 'Time logged and sent to Google Sheets successfully!',
            duration: 5
          });
        } catch (err) {
          console.error('Error:', err);
          t.alert({
            message: 'Failed to log time. Please try again.',
            duration: 5
          });
        }
      }
    }];
  }
});

// Function to post a comment to Trello and Google Sheets via backend
async function postCommentToBackend(cardId, cardName, username, action) {
  const backendTrelloUrl = `${ENV.SERVER_URL}/trello/comment`;
  const backendGoogleUrl = `${ENV.SERVER_URL}/google/sheets`;

  // Generate the timestamp
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timestamp = `${formattedTime} - ${formattedDate}`;
  const comment = `${username} ${action} at [${timestamp}]`;

  try {
    // Post comment to Trello backend
    const trelloResponse = await fetch(backendTrelloUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardId: cardId,
        comment: comment,
      }),
    });

    if (!trelloResponse.ok) {
      console.error('Failed to post comment to Trello:', await trelloResponse.text());
    } else {
      console.log(`Successfully posted ${action} comment to Trello.`);
    }

    // Send data to Google Sheets backend
    const sheetsPayload = {
      boardName: 'Your Trello Board Name', // Replace with dynamic board name logic if needed
      cardName: cardName,
      userName: username,
      action: action,
      timestamp: timestamp,
    };

    const sheetsResponse = await fetch(backendGoogleUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheetsPayload),
    });

    if (!sheetsResponse.ok) {
      console.error('Failed to send data to Google Sheets:', await sheetsResponse.text());
    } else {
      console.log('Successfully sent data to Google Sheets.');
    }
  } catch (error) {
    console.error('Error during backend requests:', error.message);
  }
}
