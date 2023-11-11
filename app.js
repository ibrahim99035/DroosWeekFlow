// app.js
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./database');
const { authenticateToken } = require('./middleware').authenticateToken;

const authRoutes = require('./auth');
const week_process = require('./app/WeekFrame');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', authRoutes); 

app.use('/process', week_process);

app.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'This route is protected' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});