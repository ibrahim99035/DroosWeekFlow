const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    jwt.verify(token, 'your_secret_key', (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
  
      req.user = user;
      next();
    });
};  

// Replace these with your actual email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ebrahimaboeita990@gmail.com',
    pass: 'your-email-password'
  }
});

function generateToken() {
  return Math.random().toString(36).substr(2);
}

module.exports = { authenticateToken, generateToken, transporter };