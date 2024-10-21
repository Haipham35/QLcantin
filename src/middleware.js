require('dotenv').config();

// module.exports = function restrict(req, res, next) {
//     if (!req.session.isAuthenticated) {
//         return res.redirect('/user/login')
// //     }
// //     if (req.session.isAuthenticated && req.session.authUser.permission === "admin") {
// //         return res.redirect('/user/login')
// //     }
// //     next()
// // }

// module.exports = function restrict(req, res, next) {
//     if (process.env.NODE_ENV !== 'test' && (!req.session.isAuthenticated || req.session.authUser.permission !== "admin")) {
//         return res.redirect('/user/login');
//     }
//     next();
// }
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
            return res.sendStatus(403); // Forbidden
        }
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