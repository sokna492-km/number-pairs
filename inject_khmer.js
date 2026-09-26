const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
const kmStrings = JSON.parse(fs.readFileSync('strings_km_generated.json', 'utf8'));

// 1. Add Google Fonts for Khmer in <head>
const fontTags = `  <!-- Khmer Font Support -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&family=Noto+Sans+Khmer:wght@100..900&display=swap" rel="stylesheet">
  <style>
    body, button, input, select, textarea {
      font-family: 'Kantumruy Pro', 'Noto Sans Khmer', 'Khmer OS Battambang', sans-serif !important;
    }
    #lang-switcher {
      position: fixed;
      top: 10px;
      right: 12px;
      z-index: 999999;
      display: flex;
      gap: 6px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      padding: 4px 8px;
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
      font-size: 13px;
      font-weight: 600;
      color: #fff;
    }
    #lang-switcher button {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      padding: 4px 10px;
      border-radius: 9999px;
      cursor: pointer;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s ease;
    }
    #lang-switcher button:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.15);
    }
    #lang-switcher button.active {
      background: #2563eb;
      color: #ffffff;
      font-weight: 700;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
    }
  </style>`;

if (!html.includes('Kantumruy Pro')) {
  html = html.replace('</head>', `${fontTags}\n</head>`);
}

// 2. Add language switcher button right after <body>
const switcherMarkup = `
  <div id="lang-switcher">
    <button id="btn-km" onclick="switchLanguage('km')">🇰🇭 ភាសាខ្មែរ</button>
    <button id="btn-en" onclick="switchLanguage('en')">🇺🇸 English</button>
  </div>
  <script>
    (function() {
      const urlParams = new URLSearchParams(window.location.search);
      const currentLocale = urlParams.get('locale') || localStorage.getItem('phet_sim_locale') || 'km';
      
      // If no query param set yet, redirect to default km
      if (!urlParams.has('locale')) {
        urlParams.set('locale', currentLocale);
        window.history.replaceState({}, '', '?' + urlParams.toString());
      }
      
      window.addEventListener('DOMContentLoaded', () => {
        const btnKm = document.getElementById('btn-km');
        const btnEn = document.getElementById('btn-en');
        if (currentLocale === 'en') {
          btnEn.classList.add('active');
        } else {
          btnKm.classList.add('active');
        }
      });
      
      window.switchLanguage = function(locale) {
        localStorage.setItem('phet_sim_locale', locale);
        const params = new URLSearchParams(window.location.search);
        params.set('locale', locale);
        window.location.search = params.toString();
      };
    })();
  </script>
`;

if (!html.includes('lang-switcher')) {
  html = html.replace('<body style="background-color:black;">', `<body style="background-color:black;">\n${switcherMarkup}`);
}

// 3. Register Khmer locale in localeData and allow locale switching
html = html.replace(
  '"vi":{"locale3":"vie","englishName":"Vietnamese","localizedName":"Tiếng Việt","direction":"ltr","bcp47":"vi"}',
  '"vi":{"locale3":"vie","englishName":"Vietnamese","localizedName":"Tiếng Việt","direction":"ltr","bcp47":"vi"},"km":{"locale3":"khm","englishName":"Khmer","localizedName":"ភាសាខ្មែរ","direction":"ltr","bcp47":"km"}'
);

html = html.replace(
  'window.phet.chipper.allowLocaleSwitching = false;',
  'window.phet.chipper.allowLocaleSwitching = true;'
);

// 4. Inject window.phet.chipper.strings.km
const kmPayload = JSON.stringify(kmStrings);
const kmAssignment = `window.phet.chipper.strings.km = ${kmPayload};\n`;
const existingKmStringsIndex = html.indexOf('window.phet.chipper.strings.km =');

if (existingKmStringsIndex >= 0) {
  const metadataIndex = html.indexOf('window.phet.chipper.stringMetadata =', existingKmStringsIndex);
  if (metadataIndex < 0) {
    throw new Error('Could not find string metadata after the existing Khmer strings payload');
  }
  html = html.slice(0, existingKmStringsIndex) + kmAssignment + html.slice(metadataIndex);
} else {
  html = html.replace(
    'window.phet.chipper.stringMetadata =',
    `${kmAssignment}window.phet.chipper.stringMetadata =`
  );
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully injected Khmer font, switcher UI, and strings into index.html');
