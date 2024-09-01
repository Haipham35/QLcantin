// routes/users.js
const express = require('express');
const router = express.Router();
const AdminRouter = require('../app/controllers/AdminController');
const ItemRouter = require('../app/models/Items');
const ThongBaoRouter = require('../app/models/Thongbao');
const OrdersRouter = require('../app/controllers/OrdersController');
const restrict = require('../middleware');

// Lấy tất cả người dùng
router.get('/users',restrict, AdminRouter.getAllUsers);
// Lấy người dùng theo ID
router.get('/user/:id',restrict, AdminRouter.getUserById);
// Tạo người dùng mới
router.post('/user',restrict, AdminRouter.createUser);
// Cập nhật người dùng
router.put('/user/:id',restrict, AdminRouter.updateUser);
// Xóa người dùng
router.delete('/user/:id',restrict, AdminRouter.deleteUser);

// quan ly hang muc
router.post('/categories',restrict, AdminRouter.createCategory);
router.get('/categories',restrict, AdminRouter.getAllCategories);
router.get('/categories/:id',restrict, AdminRouter.getCategoryById);
router.put('/categories/:id',restrict, AdminRouter.updateCategory);
router.delete('/categories/:id',restrict, AdminRouter.deleteCategory);
//quan ly san pham
router.post('/items',restrict, ItemRouter.createItem);
router.get('/items',restrict, ItemRouter.getAllItems);
router.get('/items/:item_id',restrict, ItemRouter.getItemById);
router.put('/items/:item_id',restrict, ItemRouter.updateItem);
router.delete('/items/:item_id',restrict, ItemRouter.deleteItem);
//quan ly thong bao
router.get('/thongbao',restrict, ThongBaoRouter.getAllThongBaos);
router.get('/thongbao/:idThongBao',restrict, ThongBaoRouter.getThongBaoById);
router.post('/thongbao',restrict, ThongBaoRouter.createThongBao);
router.put('/thongbao/:idThongBao',restrict, ThongBaoRouter.updateThongBaoById);
router.delete('/thongbao/:idThongBao',restrict, ThongBaoRouter.deleteThongBaoById); 

//quan ly don hang
router.post('/create-order',restrict, OrdersRouter.createOrder);
router.put('/confirm-order/:order_id',restrict, OrdersRouter.confirmOrder);

module.exports = router;
