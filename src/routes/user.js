const express = require('express');
const loginRouter = require('../app/controllers/LoginController');
const OrdersRouter = require('../app/controllers/OrdersController');
const UserRouter = require('../app/controllers/UserController');
const router = express.Router();

router.post('/login', loginRouter.login)

//lam viec voi don hang
router.post('/cancel-order/:order_id ', UserRouter.cancelOrder)
router.post('/create-order', OrdersRouter.createOrder)
module.exports = router;