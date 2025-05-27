// src/server.js
require('dotenv').config(); // You'll need to install this: npm install dotenv

const app = require('./app');

const PORT = process.env.PORT || 3001; // Use port from .env or default to 3001

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});