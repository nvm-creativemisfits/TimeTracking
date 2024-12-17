/* global TrelloPowerUp */

console.log('Client.js loaded successfully!');

// Initialize Trello Power-Up
const Promise = TrelloPowerUp.Promise;

TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [
      {
        text: 'Log Time',
        icon: 'https://your-icon-url.com/icon.png',
        callback: function (t) {
          return t.card('id', 'name').then(function (card) {
            return fetch('https://your-render-app.onrender.com/trello/comment', {
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
      },
    ];
  },
});
