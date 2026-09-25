const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove previous injected topInjector if present
const startMark = '<!-- Kantumruy Pro Font Integration & Top-Right Language Toggle -->';
const startIdx = html.indexOf(startMark);
if (startIdx !== -1) {
  const endIdx = html.indexOf('</head>', startIdx);
  if (endIdx !== -1) {
    html = html.slice(0, startIdx) + html.slice(endIdx);
  }
}

// 2. Build the refined, minimalist, clean language toggle and Kantumruy Pro integration
const modernInjection = `  <!-- Kantumruy Pro Font & Minimalist Language Toggle -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">

  <style id="kantumruy-custom-styles">
    /* Enforce Kantumruy Pro font */
    * {
      font-family: 'Kantumruy Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }

    canvas, svg text, svg tspan {
      font-family: 'Kantumruy Pro', sans-serif !important;
    }

    /* Minimalist, clean floating segmented language switch */
    #top-lang-toggle-bar {
      position: fixed;
      top: 12px;
      right: 14px;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      gap: 2px;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: 3px;
      border-radius: 9999px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
      pointer-events: auto !important;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
    }

    .lang-btn {
      appearance: none;
      -webkit-appearance: none;
      border: none;
      outline: none;
      background: transparent;
      color: #64748b;
      font-family: 'Kantumruy Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
      padding: 5px 12px;
      border-radius: 9999px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .lang-btn:hover:not(.active) {
      color: #0f172a;
      background: rgba(0, 0, 0, 0.04);
    }

    .lang-btn.active {
      background: #0f172a;
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.18);
    }

    .lang-btn:focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 1px;
    }
  </style>

  <script id="kantumruy-and-locale-controller">
    // Safe storage helper (prevents iframe SecurityError)
    window.__safeStorage = {
      get: function(k) {
        try { return localStorage.getItem(k); } catch(e) { return null; }
      },
      set: function(k, v) {
        try { localStorage.setItem(k, v); } catch(e) {}
      }
    };

    // Determine target locale (default to 'km' on first visit)
    (function() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        let loc = urlParams.get('locale');
        if (!loc) {
          loc = window.__safeStorage.get('phet_sim_locale') || 'km';
          // Set in safe storage
          window.__safeStorage.set('phet_sim_locale', loc);
        }
        window.__currentAppLocale = loc;
        document.documentElement.lang = loc;
      } catch(e) {
        window.__currentAppLocale = 'km';
      }
    })();

    // Canvas font interception to prioritize Kantumruy Pro
    (function() {
      try {
        const proto = CanvasRenderingContext2D.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(proto, 'font');
        if (descriptor && descriptor.set) {
          const originalSetter = descriptor.set;
          Object.defineProperty(proto, 'font', {
            set: function(val) {
              if (typeof val === 'string' && !val.includes('Kantumruy Pro')) {
                const sizeRegex = /([0-9]+(?:\\.[0-9]+)?(?:px|pt|em|rem|%)\\s+)/i;
                if (sizeRegex.test(val)) {
                  val = val.replace(sizeRegex, "$1'Kantumruy Pro', ");
                } else {
                  val = val + ", 'Kantumruy Pro'";
                }
              }
              return originalSetter.call(this, val);
            },
            get: descriptor.get
          });
        }
      } catch (err) {
        console.warn('Canvas font patch:', err);
      }
    })();

    // Global switch function for English <-> Khmer
    window.switchLanguage = function(locale) {
      window.__currentAppLocale = locale;
      window.__safeStorage.set('phet_sim_locale', locale);
      document.documentElement.lang = locale;

      // Update URL without full page reload
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('locale', locale);
        window.history.replaceState(null, '', url.toString());
      } catch(e) {}

      // Update UI buttons immediately
      window.updateToggleUI(locale);

      // Dynamic switch in PhET simulation if localeProperty exists
      let switched = false;
      try {
        if (window.phet && window.phet.joist && window.phet.joist.localeProperty) {
          window.phet.joist.localeProperty.value = locale;
          switched = true;
        }
      } catch(err) {
        console.warn('localeProperty value set error:', err);
      }

      // Fallback: If localeProperty is not ready yet, keep checking or reload
      if (!switched) {
        let attempts = 0;
        const interval = setInterval(function() {
          attempts++;
          if (window.phet && window.phet.joist && window.phet.joist.localeProperty) {
            clearInterval(interval);
            window.phet.joist.localeProperty.value = locale;
          } else if (attempts > 8) {
            clearInterval(interval);
            try {
              const params = new URLSearchParams(window.location.search);
              params.set('locale', locale);
              window.location.search = params.toString();
            } catch(e) {}
          }
        }, 100);
      }
    };

    // Update UI active buttons
    window.updateToggleUI = function(locale) {
      const isKm = locale !== 'en';
      const btnKm = document.getElementById('lang-btn-km');
      const btnEn = document.getElementById('lang-btn-en');
      if (btnKm && btnEn) {
        if (isKm) {
          btnKm.classList.add('active');
          btnKm.setAttribute('aria-pressed', 'true');
          btnEn.classList.remove('active');
          btnEn.setAttribute('aria-pressed', 'false');
        } else {
          btnEn.classList.add('active');
          btnEn.setAttribute('aria-pressed', 'true');
          btnKm.classList.remove('active');
          btnKm.setAttribute('aria-pressed', 'false');
        }
      }
    };

    // Mount toggle UI
    function mountToggleUI() {
      if (document.getElementById('top-lang-toggle-bar')) return;

      const loc = window.__currentAppLocale || 'km';
      const isKm = loc !== 'en';

      const bar = document.createElement('div');
      bar.id = 'top-lang-toggle-bar';
      bar.setAttribute('role', 'group');
      bar.setAttribute('aria-label', 'Language toggle');

      // Stop PhET scenery pointer interception
      const stopProp = function(e) { e.stopPropagation(); };
      ['pointerdown', 'mousedown', 'touchstart', 'pointerup', 'mouseup', 'touchend'].forEach(function(ev) {
        bar.addEventListener(ev, stopProp, { passive: true });
      });

      bar.innerHTML = \`
        <button id="lang-btn-km" class="lang-btn \${isKm ? 'active' : ''}" aria-pressed="\${isKm ? 'true' : 'false'}" title="ភាសាខ្មែរ">
          ខ្មែរ
        </button>
        <button id="lang-btn-en" class="lang-btn \${!isKm ? 'active' : ''}" aria-pressed="\${!isKm ? 'true' : 'false'}" title="English">
          English
        </button>
      \`;

      // Attach direct click handlers
      const btnKm = bar.querySelector('#lang-btn-km');
      const btnEn = bar.querySelector('#lang-btn-en');

      btnKm.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.switchLanguage('km');
      });

      btnEn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.switchLanguage('en');
      });

      // Font glyph preloader
      const fontPreloader = document.createElement('div');
      fontPreloader.style.cssText = 'position:absolute;left:-9999px;top:-9999px;visibility:hidden;font-family:\\'Kantumruy Pro\\';font-size:24px;pointer-events:none;';
      fontPreloader.textContent = 'កខគឃង ការផ្គូផ្គងចំនួន សេចក្តីផ្តើម ដប់ ម្ភៃ ផលបូក ល្បែងកម្សាន្ត';

      document.body.appendChild(bar);
      document.body.appendChild(fontPreloader);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountToggleUI);
    } else {
      mountToggleUI();
    }

    // Keep UI synced with simulation localeProperty
    const syncWatcher = setInterval(function() {
      if (window.phet && window.phet.joist && window.phet.joist.localeProperty) {
        clearInterval(syncWatcher);
        const target = window.__currentAppLocale || 'km';
        if (window.phet.joist.localeProperty.value !== target) {
          window.phet.joist.localeProperty.value = target;
        }
        window.updateToggleUI(window.phet.joist.localeProperty.value);
        window.phet.joist.localeProperty.lazyLink(function(newVal) {
          window.__currentAppLocale = newVal;
          window.__safeStorage.set('phet_sim_locale', newVal);
          window.updateToggleUI(newVal);
          try {
            const url = new URL(window.location.href);
            url.searchParams.set('locale', newVal);
            window.history.replaceState(null, '', url.toString());
          } catch(e) {}
        });
      }
    }, 100);
    setTimeout(function() { clearInterval(syncWatcher); }, 30000);
  </script>
`;

html = html.replace('</head>', `${modernInjection}\n</head>`);

// 3. Make sure window.phet.chipper.locale is dynamically set from targetLocale
html = html.replace(
  /window\.phet\.chipper\.locale\s*=\s*['"][^'"]+['"]/g,
  "window.phet.chipper.locale = (window.__currentAppLocale || 'km')"
);

// 4. Make sure fallback queryParameters.locale is also window.__currentAppLocale
html = html.replace(
  'null===phet.chipper.queryParameters.locale&&(phet.chipper.queryParameters.locale="km")',
  'null===phet.chipper.queryParameters.locale&&(phet.chipper.queryParameters.locale=(window.__currentAppLocale||\"km\"))'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html with minimalist language switch!');
