// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database'); // Import the database connection

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const {username, full_name, age, gender, email, password} = req.body;
    if (!username || !full_name || !age || !gender  || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    try {
      await db.execute('INSERT INTO users (username, full_name, age, gender, email, password) VALUES (?, ?, ?, ?, ?, ?)', [username, full_name, age, gender, email, hashedPassword]);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error registering user' + error});
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password DATABASE' });
      }
  
      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign({ username: user.username, id: user.id }, 'your_secret_key');
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
});  

// Reset Password Route
router.post('/reset-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
  
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  
      if (isPasswordValid) {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, user.id]);
        res.json({ message: 'Password reset successfully' });
      } else {
        res.status(401).json({ error: 'Invalid old password' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error resetting password' });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;