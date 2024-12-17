/* global TrelloPowerUp */

// Ensure Trello Power-Up is initialized correctly
const Promise = TrelloPowerUp.Promise;

console.log('Client.js loaded successfully!');

// Environment variable with server URL
const ENV = {
  SERVER_URL: 'https://timetracking-auxd.onrender.com' // Replace this if needed
};

// Initialize Trello Power-Up
TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [{
      icon: 'https://newvisualmedia.com/wp-content/uploads/2024/12/hour-glass-login.png', // Replace with your actual icon URL
      text: 'Log Time',
      callback: function (t) {
        logTime(t); // Call the async function
      }
    }];
  }
});

// Async function to log time
async function logTime(t) {
  try {
    const card = await t.card('id', 'name');
    const user = await t.member('fullName'); // Get Trello member's full name

    // Log the time as a comment
    const action = 'logged in';
    await postCommentToBackend(card.id, card.name, user.fullName, action);

    t.alert({
      message: 'Time logged successfully!',
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

// Function to post comment to backend
async function postCommentToBackend(cardId, cardName, username, action) {
  const backendUrl = `${ENV.SERVER_URL}/trello/comment`;

  // Create timestamp
  const now = new Date();
  const timestamp = `${now.toLocaleTimeString()} - ${now.toLocaleDateString()}`;
  const comment = `${username} ${action} at [${timestamp}]`;

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId, comment }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    console.log('Successfully posted comment to Trello backend.');
  } catch (error) {
    console.error('Error posting to backend:', error.message);
  }
}
