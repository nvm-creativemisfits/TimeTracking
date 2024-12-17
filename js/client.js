/* global TrelloPowerUp */

console.log('Client.js loaded successfully!');

// Initialize Trello Power-Up
const Promise = TrelloPowerUp.Promise;

TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [
      {
        text: 'Log Time',
        icon: 'https://newvisualmedia.com/wp-content/uploads/2024/12/hour-glass-login.png',
        callback: function (t) {
  return t.card('id', 'name').then(function (card) {
    return fetch('https://timetracking-auxd.onrender.com/trello/comment', { // Updated URL here
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardId: card.id,
        comment: `Time Log added for card: ${card.name}`,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Comment added successfully:', data);
      t.alert({
        message: 'Time log successfully added!',
        duration: 5,
      });
    })
    .catch((error) => {
      console.error('Error adding comment:', error);
      t.alert({
        message: 'Failed to add time log.',
        duration: 5,
      });
    });
  });
},
