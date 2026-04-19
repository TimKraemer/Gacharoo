/* Development/service-worker placeholder to avoid noisy 404s. */
self.addEventListener("install", () => {
	self.skipWaiting()
})

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim())
})
