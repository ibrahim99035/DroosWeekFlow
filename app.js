// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const { authenticateToken } = require('./middleware');
const authRoutes = require('./auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes); // Use the authentication routes

app.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'This route is protected' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});