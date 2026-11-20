/* 경인금식수련회 기도앱 서비스 워커: 기도 알림(웹 푸시) 받기 */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = { body: event.data && event.data.text() }; }
  const title = data.title || '경인금식수련회 기도앱';
  event.waitUntil(self.registration.showNotification(title, {
    body: data.body || '오늘의 기도를 이어가요 🙏',
    icon: 'assets/icon-192.png',
    badge: 'assets/icon-192.png',
    tag: data.tag || 'prayer',
    renotify: true,
    data: { url: data.url || './#journey' },
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || './#journey', self.registration.scope).href;
  event.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) {
      if (w.url.startsWith(self.registration.scope)) {
        await w.focus();
        try { await w.navigate(target); } catch (e) { /* 같은 페이지면 무시 */ }
        return;
      }
    }
    await self.clients.openWindow(target);
  })());
});
