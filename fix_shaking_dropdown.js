const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove previous injected snippet if present
const startMark = '<!-- Kantumruy Pro Font & Minimalist Language Toggle -->';
const startIdx = html.indexOf(startMark);
if (startIdx !== -1) {
  const endIdx = html.indexOf('</head>', startIdx);
  if (endIdx !== -1) {
    html = html.slice(0, startIdx) + html.slice(endIdx);
  }
}

// 2. Build rock-solid non-shaking Dropdown UI
const dropdownInjection = `  <!-- Kantumruy Pro Font & Minimalist Language Toggle -->
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

    /* Floating Dropdown Wrapper */
    #top-lang-dropdown-wrapper {
      position: fixed;
      top: 14px;
      right: 16px;
      z-index: 2147483647;
      pointer-events: auto !important;
      touch-action: manipulation;
      user-select: none;
      -webkit-user-select: none;
      transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.22s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    /* Hidden in practice pages */
    #top-lang-dropdown-wrapper.sim-screen-hidden {
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
      transform: translateY(-8px) scale(0.96) !important;
    }

    /* Trigger Button */
    .lang-trigger-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 9999px;
      border: 1px solid rgba(229, 231, 235, 1);
      padding: 6px 14px;
      font-size: 14px;
      line-height: 1.25rem;
      background-color: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08);
      color: #1f2937;
      cursor: pointer;
      font-family: 'Kantumruy Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      transition: background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      appearance: none;
      outline: none;
    }

    .lang-trigger-btn:hover {
      background-color: rgba(249, 250, 251, 0.98);
      border-color: rgba(209, 213, 219, 1);
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    }

    .flag-icon {
      font-size: 15px;
      line-height: 1;
    }

    .chevron-icon {
      width: 16px;
      height: 16px;
      color: #6b7280;
      transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      margin-left: 2px;
    }

    .lang-trigger-btn.open .chevron-icon {
      transform: rotate(180deg);
    }

    /* Dropdown Menu */
    .lang-dropdown-menu {
      position: absolute;
      right: 0;
      margin-top: 8px;
      width: 180px;
      border-radius: 14px;
      overflow: hidden;
      background-color: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(229, 231, 235, 1);
      display: flex;
      flex-direction: column;
      padding: 6px;
      gap: 3px;
    }

    .lang-option-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 8px 12px;
      font-size: 14px;
      text-align: left;
      border-radius: 10px;
      border: none;
      background: transparent;
      cursor: pointer;
      color: #1f2937;
      font-family: 'Kantumruy Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      transition: background-color 0.15s ease, color 0.15s ease;
      outline: none;
    }

    .lang-option-btn:hover {
      background-color: #f3f4f6;
    }

    .lang-option-btn.selected {
      font-weight: 600;
      color: #2563eb;
      background-color: rgba(239, 246, 255, 0.85);
    }

    .check-icon {
      width: 16px;
      height: 16px;
      color: #2563eb;
      margin-left: auto;
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

    const languages = [
      { code: "en", label: "English", flag: "🇺🇸" },
      { code: "km", label: "ភាសាខ្មែរ", flag: "🇰🇭" }
    ];

    // Determine target locale (default to 'km' on first visit)
    (function() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        let loc = urlParams.get('locale');
        if (!loc) {
          loc = window.__safeStorage.get('phet_sim_locale') || 'km';
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

    // Function to show toggle only on home page and hide in practice pages
    window.setToggleVisibility = function(isHome) {
      const bar = document.getElementById('top-lang-dropdown-wrapper');
      if (!bar) return;
      if (isHome) {
        bar.classList.remove('sim-screen-hidden');
      } else {
        bar.classList.add('sim-screen-hidden');
      }
    };

    // Global switch function for English <-> Khmer
    window.switchLanguage = function(locale) {
      if (window.__currentAppLocale === locale && !isOpen) return;

      window.__currentAppLocale = locale;
      window.__safeStorage.set('phet_sim_locale', locale);
      document.documentElement.lang = locale;

      // Update URL without full page reload
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('locale', locale);
        window.history.replaceState(null, '', url.toString());
      } catch(e) {}

      // Close menu & update UI
      isOpen = false;
      window.renderDropdownUI(locale);

      // Dynamic switch in PhET simulation if localeProperty exists
      try {
        if (window.phet && window.phet.joist && window.phet.joist.localeProperty) {
          window.phet.joist.localeProperty.value = locale;
        }
      } catch(err) {
        console.warn('localeProperty value set error:', err);
      }
    };

    let isOpen = false;
    let lastRenderedLocale = null;
    let lastRenderedOpenState = null;

    window.renderDropdownUI = function(currentLocale, force) {
      const wrapper = document.getElementById('top-lang-dropdown-wrapper');
      if (!wrapper) return;

      // Skip re-rendering if state hasn't changed (prevents DOM shaking)
      if (!force && currentLocale === lastRenderedLocale && isOpen === lastRenderedOpenState) {
        return;
      }

      lastRenderedLocale = currentLocale;
      lastRenderedOpenState = isOpen;

      const selected = languages.find(l => l.code === currentLocale) || languages[1]; // default km

      wrapper.innerHTML = \`
        <button id="lang-trigger-btn" class="lang-trigger-btn \${isOpen ? 'open' : ''}" aria-expanded="\${isOpen}">
          <span class="flag-icon">\${selected.flag}</span>
          <span>\${selected.label}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-icon">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
        \${isOpen ? \`
          <div class="lang-dropdown-menu" role="menu">
            \${languages.map(lang => {
              const isSel = lang.code === selected.code;
              return \`
                <button
                  class="lang-option-btn \${isSel ? 'selected' : ''}"
                  data-code="\${lang.code}"
                  role="menuitem"
                >
                  <span class="flag-icon">\${lang.flag}</span>
                  <span style="flex: 1;">\${lang.label}</span>
                  \${isSel ? \`
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="check-icon">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  \` : ''}
                </button>
              \`;
            }).join('')}
          </div>
        \` : ''}
      \`;

      // Attach trigger handler
      const btnTrigger = wrapper.querySelector('#lang-trigger-btn');
      if (btnTrigger) {
        btnTrigger.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          isOpen = !isOpen;
          window.renderDropdownUI(window.__currentAppLocale, true);
        });
      }

      // Attach item handlers
      const optionBtns = wrapper.querySelectorAll('.lang-option-btn');
      optionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          const code = btn.getAttribute('data-code');
          window.switchLanguage(code);
        });
      });
    };

    // Mount Dropdown UI
    function mountDropdownUI() {
      if (document.getElementById('top-lang-dropdown-wrapper')) return;

      const loc = window.__currentAppLocale || 'km';

      const wrapper = document.createElement('div');
      wrapper.id = 'top-lang-dropdown-wrapper';

      // Stop PhET scenery pointer interception
      const stopProp = function(e) { e.stopPropagation(); };
      ['pointerdown', 'mousedown', 'touchstart', 'pointerup', 'mouseup', 'touchend'].forEach(function(ev) {
        wrapper.addEventListener(ev, stopProp, { passive: true });
      });

      // Close on click outside
      document.addEventListener('mousedown', function(e) {
        if (isOpen && wrapper && !wrapper.contains(e.target)) {
          isOpen = false;
          window.renderDropdownUI(window.__currentAppLocale, true);
        }
      });

      document.body.appendChild(wrapper);
      window.renderDropdownUI(loc, true);

      // Check current screen state immediately
      if (window.phet && window.phet.joist && window.phet.joist.sim && window.phet.joist.sim.selectedScreenProperty) {
        const isHome = (window.phet.joist.sim.selectedScreenProperty.value === window.phet.joist.sim.homeScreen);
        window.setToggleVisibility(isHome);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountDropdownUI);
    } else {
      mountDropdownUI();
    }

    // Keep UI synced with simulation localeProperty & selectedScreenProperty (Home Screen only)
    const syncWatcher = setInterval(function() {
      if (window.phet && window.phet.joist) {
        // Locale synchronization
        if (window.phet.joist.localeProperty) {
          const target = window.__currentAppLocale || 'km';
          if (window.phet.joist.localeProperty.value !== target) {
            window.phet.joist.localeProperty.value = target;
            window.renderDropdownUI(target, true);
          }
          if (!window.phet.joist.__localeLinked) {
            window.phet.joist.__localeLinked = true;
            window.phet.joist.localeProperty.lazyLink(function(newVal) {
              window.__currentAppLocale = newVal;
              window.__safeStorage.set('phet_sim_locale', newVal);
              window.renderDropdownUI(newVal, true);
              try {
                const url = new URL(window.location.href);
                url.searchParams.set('locale', newVal);
                window.history.replaceState(null, '', url.toString());
              } catch(e) {}
            });
          }
        }

        // Screen synchronization: Visible ONLY on Home Page, hidden in practice pages
        if (window.phet.joist.sim && window.phet.joist.sim.selectedScreenProperty) {
          const sim = window.phet.joist.sim;
          const isHome = (sim.selectedScreenProperty.value === sim.homeScreen);
          window.setToggleVisibility(isHome);

          if (!sim.__screenVisibilityHooked) {
            sim.__screenVisibilityHooked = true;
            sim.selectedScreenProperty.link(function(screen) {
              const isHomeScreen = (screen === sim.homeScreen);
              window.setToggleVisibility(isHomeScreen);
            });
          }
        }
      }
    }, 100);

    // Continuous background monitor for screen visibility only (never touches renderDropdownUI)
    setInterval(function() {
      if (window.phet && window.phet.joist && window.phet.joist.sim && window.phet.joist.sim.selectedScreenProperty) {
        const sim = window.phet.joist.sim;
        const isHome = (sim.selectedScreenProperty.value === sim.homeScreen);
        window.setToggleVisibility(isHome);
      }
    }, 200);
  </script>
`;

html = html.replace('</head>', `${dropdownInjection}\n</head>`);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully fixed shaking dropdown in index.html!');
