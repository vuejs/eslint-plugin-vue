// https://github.com/NekR/self-destroying-sw
/* globals self */
self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  self.registration
    .unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => {
      for (const client of clients) client.navigate(client.url)
    })
})
