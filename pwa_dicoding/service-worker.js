importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox)
  console.log('Workbox berhasil dimuat');
else
  console.log('Workbox gagal dimuat');

// precache
workbox.precaching.precacheAndRoute([
    { url: 'index.html', revision: '2' },
    { url: 'nav.html', revision: '1' },
    { url: 'matches.html', revision: '1' },
    { url: 'teams.html', revision: '1' },
    { url: 'team.html', revision: '1' },
    { url: 'favorites.html', revision: '1' },
    { url: 'manifest.json', revision: '2' },
    { url: 'css/materialize.min.css', revision: '1' },
    { url: 'css/mystyle.css', revision: '1' },
    { url: 'js/materialize.min.js', revision: '1' },
    { url: 'js/nav.js', revision: '1' },
    { url: 'js/api.js', revision: '1' },
    { url: 'js/db.js', revision: '1' },
    { url: 'js/loadsw.js', revision: '1' },
]);

// routing
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
      }),
    ],
  }),
);

workbox.routing.registerRoute(
  /^https:\/\/upload\.wikimedia\.org/,
  workbox.strategies.cacheFirst({
    cacheName: 'wikimedia-team-badges',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 30,
        maxEntries: 30,
      }),
    ],
  })
);

// notification
self.addEventListener('push', function(event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: '/img/premier-league-logo-400x400.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
