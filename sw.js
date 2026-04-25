const CACHE_NAME = "sign-language-interpreter-v3";

const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./js/app.js",
  "./js/ui.js",
  "./js/config.js",
  "./js/camera.js",
  "./js/videoInput.js",
  "./js/landmarks.js",
  "./js/classifier.js",
  "./js/speech.js",
  "./js/speechToText.js",
  "./js/offlineStore.js",
  "./js/onlineStore.js",
  "./data/picture-database/asl/picture_database.json",
  "./data/picture-database/bsl/picture_database.json",
  "./data/picture-database/isl/picture_database.json",
  "./data/picture-database/asl/letters/A.svg",
  "./data/picture-database/asl/letters/B.svg",
  "./data/picture-database/asl/letters/C.svg",
  "./data/picture-database/asl/phrases/HELLO.svg",
  "./data/picture-database/asl/phrases/THANK_YOU.svg",
  "./data/picture-database/asl/phrases/PLEASE.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  // Cache-first for local app resources.
  if (request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => caches.match("./index.html"));
      })
    );
  }
});
