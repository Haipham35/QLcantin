const express = require('express');
const loginRouter = require('../app/controllers/LoginController');
const OrdersRouter = require('../app/controllers/OrdersController');
const UserRouter = require('../app/controllers/UserController');
const RegisterRouter = require('../app/controllers/RegisterController');
const restrict = require('../middleware');
const router = express.Router();

router.post('/login', loginRouter.login)
router.post('/register', RegisterRouter.register);
//
router.get('/user-info', restrict.authenticateToken ,UserRouter.getUserInfo)
//lam viec voi don hang
router.post('/cancel-order/:order_id ', UserRouter.cancelOrder)
router.post('/create-order', OrdersRouter.createOrder)
module.exports = router;