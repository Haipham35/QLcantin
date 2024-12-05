const express = require('express');
const loginRouter = require('../app/controllers/LoginController');
const OrdersRouter = require('../app/controllers/OrdersController');
const UserRouter = require('../app/controllers/UserController');
const RegisterRouter = require('../app/controllers/RegisterController');
const ThongKeRouter = require('../app/controllers/ThongKeController');
const restrict = require('../middleware');
const router = express.Router();

router.post('/login', loginRouter.login)
router.post('/register', RegisterRouter.register);
//
router.get('/user-info', restrict.authenticateToken ,UserRouter.getUserInfo)
router.put('/update-user', restrict.authenticateToken, UserRouter.updateUser)
router.put('/change-password', restrict.authenticateToken, UserRouter.changePassword)
//lam viec voi don hang
router.post('/cancel-order/:order_id ',restrict.authenticateToken, UserRouter.cancelOrder)
router.post('/create-order', restrict.authenticateToken, OrdersRouter.createOrder)

//Thong Ke
router.get('/thongke', restrict.authenticateToken, ThongKeRouter.thongKeUser); 
router.post('/thongke-theo-thang', restrict.authenticateToken, ThongKeRouter.thongKeTheoThang);



module.exports = router;