// authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const db = require('./database'); 
const authMidlleware = require('./middleware');

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

// Account confirmation route
app.post('/confirm/:token', async (req, res) => {
  const { token } = req.params;

  // Retrieve user ID associated with the token
  const userId = Object.keys(confirmationTokens).find(id => confirmationTokens[id] === token);

  if (!userId) {
    return res.status(404).json({ error: 'Invalid token' });
  }

  // Update the user's confirmation status in the database
  try {
    await db.execute('UPDATE users SET confirmed = 1 WHERE id = ?', [userId]);

    // Remove the used token
    delete confirmationTokens[userId];

    res.status(200).json({ message: 'Account confirmed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error confirming account' + error });
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

// Password reset request route
let resetTokens = {};
app.post('/reset-password-request', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email in the database
    const [user] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = user[0].id;

    // Generate a reset token
    const resetToken = authMidlleware.generateToken();
    resetTokens[userId] = resetToken;

    // Send an email with the password reset link
    const mailOptions = {
      from: 'ebrahimaboeita990@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Use the following link to reset your password: http://localhost:3000/reset/${resetToken}`
    };

    authMidlleware.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending password reset email' });
      }

      res.status(200).json({ message: 'Password reset email sent successfully' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error finding user' + error });
  }
});

// Password reset route
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Retrieve user ID associated with the token
  const userId = Object.keys(resetTokens).find(id => resetTokens[id] === token);

  if (!userId) {
    return res.status(404).json({ error: 'Invalid reset token' });
  }

  // Update the user's password in the database
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    // Remove the used reset token
    delete resetTokens[userId];

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error resetting password' + error });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;