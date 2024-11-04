// routes/users.js
const express = require('express');
const router = express.Router();
const AdminRouter = require('../app/controllers/AdminController');
const ItemRouter = require('../app/models/Items');
const ThongBaoRouter = require('../app/models/Thongbao');
const OrdersRouter = require('../app/controllers/OrdersController');
const restrict = require('../middleware');

// Lấy tất cả người dùng
router.get('/users',restrict.checkAdmin, AdminRouter.getAllUsers);
// Lấy người dùng theo ID
router.get('/user/:id',restrict.checkAdmin, AdminRouter.getUserById);
// Tạo người dùng mới
router.post('/user',restrict.checkAdmin, AdminRouter.createUser);
// Cập nhật người dùng
router.put('/user/:id',restrict.checkAdmin, AdminRouter.updateUser);
// Xóa người dùng
router.delete('/user/:id',restrict.checkAdmin, AdminRouter.deleteUser);

// quan ly hang muc
router.post('/categories',restrict.checkAdmin, AdminRouter.createCategory);
router.get('/categories',restrict.checkAdmin, AdminRouter.getAllCategories);
router.get('/categories/:id',restrict.checkAdmin, AdminRouter.getCategoryById);
router.put('/categories/:id',restrict.checkAdmin, AdminRouter.updateCategory);
router.delete('/categories/:id',restrict.checkAdmin, AdminRouter.deleteCategory);
//quan ly san pham
router.post('/items',restrict.checkAdmin, ItemRouter.createItem);
router.get('/items',restrict.checkAdmin, ItemRouter.getAllItems);
router.get('/items/:item_id',restrict.checkAdmin, ItemRouter.getItemById);
router.put('/items/:item_id',restrict.checkAdmin, ItemRouter.updateItem);
router.delete('/items/:item_id',restrict.checkAdmin, ItemRouter.deleteItem);
//quan ly thong bao
router.get('/thongbaos',restrict.checkAdmin, ThongBaoRouter.getAllThongBaos);
router.get('/thongbao/:idthongbao',restrict.checkAdmin, ThongBaoRouter.getThongBaoById);
router.post('/thongbao',restrict.checkAdmin, ThongBaoRouter.createThongBao);
router.put('/thongbao/:idthongbao',restrict.checkAdmin, ThongBaoRouter.updateThongBaoById);
router.delete('/thongbao/:idthongbao',restrict.checkAdmin, ThongBaoRouter.deleteThongBaoById); 

//quan ly don hang
router.post('/create-order',restrict.checkAdmin, OrdersRouter.createOrder);
router.put('/confirm-order/:order_id',restrict.checkAdmin, OrdersRouter.confirmOrder);
router.post('/cancel-order/:order_id ',restrict.checkAdmin, OrdersRouter.cancelOrder);



module.exports = router;
