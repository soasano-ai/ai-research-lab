/* AI Research Lab display version. Update this file and cache query when releasing. */
(function () {
  'use strict';
  var version = 'v3.3.0';
  var style = document.createElement('style');
  style.textContent = '#ai-lab-version{position:fixed;top:10px;right:12px;z-index:99999;padding:7px 12px;border:1px solid #72ccb9;border-radius:999px;background:#102e40;color:#d8fff4;font:700 12px/1.4 system-ui,-apple-system,sans-serif;box-shadow:0 4px 14px #0007;pointer-events:none}body{padding-top:43px!important}@media(max-width:480px){#ai-lab-version{top:7px;right:8px;font-size:11px;padding:6px 10px}body{padding-top:40px!important}}';
  document.head.appendChild(style);
  function display() {
    if (document.getElementById('ai-lab-version')) return;
    var badge = document.createElement('div');
    badge.id = 'ai-lab-version';
    badge.setAttribute('aria-label', '現在のバージョン ' + version);
    badge.textContent = 'VERSION ' + version;
    document.body.appendChild(badge);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', display);
  else display();
})();
