require('dotenv').config();

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'black myth: wukong';
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, 'black myth: wukong', (err, user) => {
        if (err) {
          console.log("Token verification failed:", err)
          return res.sendStatus(403); // Forbidden
        }
        console.log("Decoded user:", user);
        req.user = user;
        next();
    });
};
const checkAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(token)
    if (!token) {
      return res.status(403).json({ message: 'No token provided.' });
    }
  
    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, decoded) => {
      if (err) {
        
        return res.status(500).json({ message: 'Failed to authenticate token.' });
      }
      console.log('Decoded:', decoded);
      if (decoded.role.trim() !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }
  
      req.user = decoded;
      next();
    });
  };

module.exports = {
    authenticateToken,
    checkAdmin
};