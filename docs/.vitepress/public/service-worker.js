// https://github.com/NekR/self-destroying-sw
/* globals self */
self.addEventListener('install', (e) => {
  self.skipWaiting()
})

self.addEventListener('activate', async (e) => {
  await self.registration.unregister()
  const clients = await self.clients.matchAll()
  for (const client of clients) client.navigate(client.url)
})
