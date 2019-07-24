const CACHE_NAME = "dicoding-pl";
var urlsToCache = [
  "/",
  "/nav.html",
  "/index.html",
  "/favicon.ico",
  "/manifest.json",
  "/css/materialize.min.css",
  "/css/mystyle.css",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/js/api.js",
  "/js/db.js",
  "/js/loadsw.js",
  "/matches.html",
  "/teams.html",
  "/team.html",
  "/favorites.html",
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request, {ignoreSearch: true}).then(function (response) {
            if (response) {
                // Jika response dari cache berhasil
                console.log("Load Page From Cache: " + event.request.url);
                return response;
            }
            // jika response dari cache gagal
            console.log("Load Page From Server");
            caches.open(CACHE_NAME).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    console.log("Load API Call From Server: " + event.request.url);
                    cache.put(event.request.url, response.clone());
                    return response;
                });
            })

        })
    )
});


self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

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
