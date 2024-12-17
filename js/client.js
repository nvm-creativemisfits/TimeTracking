/* global TrelloPowerUp */

console.log('Client.js loaded successfully!');

// Initialize Trello Power-Up
const Promise = TrelloPowerUp.Promise;

TrelloPowerUp.initialize({
  'card-buttons': function (t) {
    return [
      {
        // The button's name
        text: 'Add Comment',
        callback: async function (t) {
          const card = await t.card('id');
          const comment = 'Test comment from Power-Up';

          try {
            // Post to backend API
            const response = await fetch(
              'https://timetracking-auxd.onrender.com/trello/comment',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  cardId: card.id,
                  comment: comment,
                }),
              }
            );

            if (response.ok) {
              t.alert({
                message: 'Comment added successfully!',
                duration: 5,
              });
            } else {
              t.alert({
                message: 'Failed to add comment. Check server logs.',
                duration: 5,
              });
            }
          } catch (error) {
            console.error('Error posting to backend:', error);
            t.alert({
              message: 'Network error while posting comment.',
              duration: 5,
            });
          }
        },
      },
    ];
  },
});
