//cache-name
const CACHE_NAME = "moroway-app-sw-{{sw_platform}}-{{sw_version}}{{sw_beta}}";

//list of all files related to moroway app
const URLS_TO_CACHE = ["{{sw_files}}"];

//service worker code to let them do their service work
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response !== undefined) {
                return response;
            }
            var fetchRequest = event.request.clone();
            return fetch(fetchRequest)
                .then((response) => {
                    return response;
                })
                .catch(() => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        return cache.match(event.request, {ignoreSearch: true});
                    });
                });
        })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map(function (key, i) {
                    if (key !== CACHE_NAME) {
                        return caches.delete(keyList[i]);
                    }
                })
            );
        })
    );
});
