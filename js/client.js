/* global TrelloPowerUp */

// Ensure Trello Power-Up is initialized correctly
const Promise = TrelloPowerUp.Promise;

console.log('Client.js loaded successfully!');

// Environment variable with server URL
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

          // Log the time to backend
          const action = 'Logged In';
          await postCommentToBackend(card.id, card.name, user.fullName, action);

          t.alert({
            message: 'Time logged and sent successfully!',
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

// Function to post comment to backend
async function postCommentToBackend(cardId, cardName, username, action) {
  const backendUrl = `${ENV.SERVER_URL}/trello/comment`;

  // Create timestamp
  const now = new Date();
  const timestamp = `${now.toLocaleTimeString()} - ${now.toLocaleDateString()}`;
  const comment = `${username} ${action} at [${timestamp}]`;

  try {
    await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId, comment }),
    });
    console.log('Successfully posted comment to backend.');
  } catch (error) {
    console.error('Error posting to backend:', error.message);
  }
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
