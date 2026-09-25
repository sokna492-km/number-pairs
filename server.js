const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static assets from root directory
app.use(express.static(__dirname));

// Serve index.html for root and fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
