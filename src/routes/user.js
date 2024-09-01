const express = require('express');
const loginRouter = require('../app/controllers/LoginController');
const router = express.router();

router.post('/login', loginRouter.login)


module.exports = router;