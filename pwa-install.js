// ═══════════════════════════════════════════
// EVENTLY PWA — Register Service Worker + Install Prompt
// Add this script to the bottom of index.html before </body>
// ═══════════════════════════════════════════

(function() {
  'use strict';

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('[Evently PWA] Service Worker registered:', reg.scope))
        .catch(err => console.log('[Evently PWA] Service Worker failed:', err));
    });
  }

  // Install Prompt (Add to Home Screen)
  let deferredPrompt;
  let installBanner;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
  });

  function showInstallBanner() {
    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Create banner
    installBanner = document.createElement('div');
    installBanner.id = 'evently-install-banner';
    installBanner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #6B46C1;
        color: white;
        padding: 12px 20px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 20px rgba(107,70,193,0.4);
        z-index: 99999;
        font-family: sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        animation: slideUp 0.4s ease;
        white-space: nowrap;
      " id="evently-install-btn">
        <span style="font-size:20px">📱</span>
        <span>Install Evently App</span>
        <button onclick="document.getElementById('evently-install-banner').remove()" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        ">✕</button>
      </div>
      <style>
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      </style>
    `;

    document.body.appendChild(installBanner);

    // Click to install
    document.getElementById('evently-install-btn').addEventListener('click', async (e) => {
      if (e.target.tagName === 'BUTTON') return;
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[Evently PWA] Install outcome:', outcome);
      deferredPrompt = null;
      installBanner.remove();
    });

    // Auto-hide after 8 seconds
    setTimeout(() => {
      if (installBanner && installBanner.parentNode) {
        installBanner.style.opacity = '0';
        installBanner.style.transition = 'opacity 0.3s';
        setTimeout(() => installBanner.remove(), 300);
      }
    }, 8000);
  }

  // Track install
  window.addEventListener('appinstalled', () => {
    console.log('[Evently PWA] App installed successfully!');
    if (installBanner) installBanner.remove();
  });

})();
