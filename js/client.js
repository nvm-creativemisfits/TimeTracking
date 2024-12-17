const TrelloPowerUp = window.TrelloPowerUp;

console.log("Client.js loaded successfully!");
console.log("Backend Server URL: https://timetracking-auxd.onrender.com");

// Initialize Trello Power-Up client
window.TrelloPowerUp.initialize({
  "card-buttons": function (t) {
    return [
      {
        icon: "https://newvisualmedia.com/wp-content/uploads/2024/12/hour-glass-login.png",
        text: "Add Comment",
        callback: function (t) {
          return t.card("id", "name").then(function (card) {
            fetch("https://timetracking-auxd.onrender.com/trello/comment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                cardId: card.id,
                comment: `Comment added from Time Logger: ${card.name}`,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Comment added successfully:", data);
                alert("Comment added successfully!");
              })
              .catch((error) => {
                console.error("Error adding comment:", error);
                alert("Failed to add comment.");
              });
          });
        },
      },
    ];
  },
});
