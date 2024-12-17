const TrelloPowerUp = window.TrelloPowerUp;

console.log("Client.js loaded successfully!");

// Initialize Trello Power-Up client
window.TrelloPowerUp.initialize({
  "card-buttons": function (t) {
    return [
      {
        icon: "https://newvisualmedia.com/wp-content/uploads/2024/12/hour-glass-login.png",
        text: "Log Time", // Button Text
        callback: function (t) {
          return t.card("id", "name").then(function (card) {
            console.log("Adding comment to card:", card.name);

            return fetch("https://timetracking-auxd.onrender.com/trello/comment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                cardId: card.id,
                comment: `Time Log added for card: ${card.name}`,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Comment added successfully:", data);
                alert("Time log successfully added!");
              })
              .catch((error) => {
                console.error("Failed to add comment:", error);
                alert("Failed to add time log.");
              });
          });
        },
      },
    ];
  },
});

