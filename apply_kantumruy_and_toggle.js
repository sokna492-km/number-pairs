const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Ensure <html lang="km">
html = html.replace(/<html(\s+[^>]*)?>/i, '<html lang="km">');

// 2. Set default window.phet.chipper.locale = 'km'
html = html.replace(/window\.phet\.chipper\.locale\s*=\s*['"][^'"]+['"]/g, "window.phet.chipper.locale = 'km'");

// 3. Set default queryParameters.locale = "km"
html = html.replace(
  'phet.chipper.queryParameters.locale="en"',
  'phet.chipper.queryParameters.locale="km"'
);

// 4. Modify Scenery Font.prototype.computeShorthand to always use 'Kantumruy Pro'
html = html.replace(
  'e+=" "+this._family,e}',
  'e+=" \'Kantumruy Pro\', "+this._family,e}'
);

// 5. Change default family in Font constructor
html = html.replace(
  'family:"sans-serif",phetioType:t.FontIO',
  'family:"\'Kantumruy Pro\', sans-serif",phetioType:t.FontIO'
);

// 6. Build the comprehensive CSS & Canvas font interceptor & Toggle Switch script for <head>
const topInjector = `
  <!-- Kantumruy Pro Font Integration & Top-Right Language Toggle -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
  
  <style id="kantumruy-custom-styles">
    /* Force Kantumruy Pro across all elements */
    * {
      font-family: 'Kantumruy Pro', 'Khmer OS Battambang', 'Noto Sans Khmer', sans-serif !important;
    }
    
    canvas, svg text, svg tspan {
      font-family: 'Kantumruy Pro', sans-serif !important;
    }

    /* Fixed top-right language toggle switch */
    #top-lang-toggle-bar {
      position: fixed;
      top: 12px;
      right: 14px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 3px 4px;
      border-radius: 9999px;
      border: 1.5px solid rgba(255, 255, 255, 0.28);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 0, 0, 0.2);
      user-select: none;
      -webkit-user-select: none;
      gap: 3px;
    }

    .top-lang-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 9999px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.75);
      font-family: 'Kantumruy Pro', sans-serif !important;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.2;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      outline: none;
      white-space: nowrap;
    }

    .top-lang-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.15);
    }

    .top-lang-btn.is-active {
      background: #2563eb;
      color: #ffffff;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.55);
    }

    .top-lang-btn .flag-icon {
      font-size: 15px;
      display: inline-block;
      line-height: 1;
    }
  </style>

  <script id="kantumruy-canvas-and-locale-init">
    // 1. Default to Khmer ('km') when entering the website
    (function() {
      const urlParams = new URLSearchParams(window.location.search);
      let targetLocale = urlParams.get('locale');
      
      if (!targetLocale) {
        // Check localStorage, default to 'km'
        targetLocale = localStorage.getItem('phet_sim_locale') || 'km';
        urlParams.set('locale', targetLocale);
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        // Redirect to ensure query parameter is set for chipper QueryStringMachine
        window.location.replace(newUrl);
        return;
      }
      
      // Store current valid locale
      localStorage.setItem('phet_sim_locale', targetLocale);
    })();

    // 2. Intercept CanvasRenderingContext2D.prototype.font to force Kantumruy Pro on Canvas
    (function() {
      try {
        const proto = CanvasRenderingContext2D.prototype;
        const descriptor = Object.getOwnPropertyDescriptor(proto, 'font');
        if (descriptor && descriptor.set) {
          const originalSetter = descriptor.set;
          Object.defineProperty(proto, 'font', {
            set: function(val) {
              if (typeof val === 'string' && !val.includes('Kantumruy Pro')) {
                const match = val.match(/^(.*?\d+(?:\\.\\d+)?(?:px|pt|em|rem|%)\\s+)(.*)$/);
                if (match) {
                  val = match[1] + "'Kantumruy Pro', " + match[2];
                } else {
                  val = "'Kantumruy Pro', " + val;
                }
              }
              return originalSetter.call(this, val);
            },
            get: descriptor.get
          });
        }
      } catch (err) {
        console.warn('Canvas font patch error:', err);
      }
    })();

    // 3. Function to toggle language
    window.toggleSimulationLanguage = function(locale) {
      localStorage.setItem('phet_sim_locale', locale);
      const params = new URLSearchParams(window.location.search);
      params.set('locale', locale);
      window.location.href = window.location.pathname + '?' + params.toString();
    };

    // 4. Inject toggle UI into DOM when document body is ready
    function injectToggleUI() {
      if (document.getElementById('top-lang-toggle-bar')) return;
      
      const currentLocale = new URLSearchParams(window.location.search).get('locale') || 'km';
      const container = document.createElement('div');
      container.id = 'top-lang-toggle-bar';
      container.setAttribute('role', 'group');
      container.setAttribute('aria-label', 'Language selection');
      
      const isKm = currentLocale !== 'en';
      
      container.innerHTML = \`
        <button id="btn-toggle-km" class="top-lang-btn \${isKm ? 'is-active' : ''}" onclick="window.toggleSimulationLanguage('km')" title="ប្តូរទៅភាសាខ្មែរ">
          <span class="flag-icon">🇰🇭</span>
          <span>ភាសាខ្មែរ</span>
        </button>
        <button id="btn-toggle-en" class="top-lang-btn \${!isKm ? 'is-active' : ''}" onclick="window.toggleSimulationLanguage('en')" title="Switch to English">
          <span class="flag-icon">🇺🇸</span>
          <span>English</span>
        </button>
      \`;
      
      // Hidden font preloader to ensure browser decodes glyphs immediately
      const fontPreloader = document.createElement('div');
      fontPreloader.style.cssText = 'position:absolute;left:-9999px;top:-9999px;visibility:hidden;font-family:\\'Kantumruy Pro\\';font-size:24px;pointer-events:none;';
      fontPreloader.textContent = 'កខគឃង ការផ្គូផ្គងចំនួន សេចក្តីផ្តើម ដប់ ម្ភៃ ផលបូក ល្បែងកម្សាន្ត';
      
      document.body.appendChild(container);
      document.body.appendChild(fontPreloader);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectToggleUI);
    } else {
      injectToggleUI();
    }
  </script>
`;

// Remove older temporary switcher or duplicate styles if any
html = html.replace(/<!-- Khmer Font Support -->[\s\S]*?<\/style>/i, '');
html = html.replace(/<div id="lang-switcher">[\s\S]*?<\/script>/i, '');

// Insert topInjector before </head>
html = html.replace('</head>', `${topInjector}\n</head>`);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully applied Kantumruy Pro font, default Khmer locale, and top-right toggle switch!');
