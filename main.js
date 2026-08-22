// Injected into the Home Assistant frontend by TizenBrew (packageType: mods).
// No secrets here: login is a one-time on-TV sign-in as the non-admin `tv` user;
// HA keeps its refresh token in this WebView. This script only adapts the UI to a remote.

(function () {
  'use strict';

  var HA_BASE = 'https://ha.home.joeconyers.com'; // HA is bound to 127.0.0.1:18123 on 2070-pc; only reachable via Caddy
  // Colour-key shortcuts → HA services. Edit freely; nothing here is secret.
  var KEYMAP = {
    ColorF0Red:    { domain: 'scene',  service: 'turn_on', data: { entity_id: 'scene.home_nightlight' } },        // "movie" until a dedicated scene exists
    ColorF1Green:  { domain: 'light',  service: 'toggle',  data: { entity_id: 'light.living_room' } },
    ColorF2Yellow: { domain: 'switch', service: 'toggle',  data: { entity_id: 'switch.fireplace_shelly' } },
    ColorF3Blue:   { domain: 'light',  service: 'toggle',  data: { entity_id: 'light.living_room_and_kitchen' } } // TODO: MM815 mount preset script once it exists in HA
  };

  // 1. Register the remote keys with Tizen so keydown events reach the page.
  try {
    if (window.tizen && tizen.tvinputdevice) {
      Object.keys(KEYMAP).forEach(function (k) { tizen.tvinputdevice.registerKey(k); });
    }
  } catch (e) { console.warn('[tizenbrew-ha] key registration failed', e); }

  // 2. Call HA services using the session the frontend already holds.
  //    hassConnection is exposed by the HA frontend; the stored refresh token logged us in.
  function callService(entry) {
    var conn = window.hassConnection;
    if (!conn) return;
    conn.then(function (c) {
      c.conn.sendMessagePromise({
        type: 'call_service',
        domain: entry.domain,
        service: entry.service,
        service_data: entry.data
      });
    });
  }

  window.addEventListener('keydown', function (ev) {
    var entry = KEYMAP[ev.key];
    if (entry) { ev.preventDefault(); callService(entry); }
  }, true);

  // 3. Cosmetic: 10-foot UI. Hide the sidebar/header, scale up, keep it awake.
  var style = document.createElement('style');
  style.textContent =
    'html { font-size: 22px !important; }' +
    'body { background: #000 !important; cursor: none; }';
  document.documentElement.appendChild(style);

  // Kiosk Mode (HACS) honours ?kiosk in the URL; add it if missing.
  if (location.href.indexOf('kiosk') === -1 && location.href.indexOf(HA_BASE) === 0) {
    location.replace(location.href + (location.search ? '&' : '?') + 'kiosk');
  }

  // Remote "Back" normally kills the WebView; swallow it on the top view.
  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 10009 && history.length <= 1) ev.preventDefault();
  }, true);
})();
