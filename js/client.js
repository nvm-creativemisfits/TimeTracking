/* global TrelloPowerUp */
TrelloPowerUp.initialize({
  'card-buttons': function (t, opts) {
    return [
      {
        icon: 'https://newvisualmedia.com/wp-content/uploads/2024/12/hour-glass-login.png', // Icon URL
        text: 'Add Time Comment',
        callback: function (t) {
          return t.popup({
            title: 'Log Time Comment',
            url: 'https://timetracking-auxd.onrender.com/popup', // Server popup route
            height: 200,
          });
        },
      },
    ];
  },
});
