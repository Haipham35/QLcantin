// routes/users.js
const express = require('express');
const router = express.Router();
const AdminRouter = require('../app/controllers/AdminController');
const ItemRouter = require('../app/models/Items');

// Lấy tất cả người dùng
router.get('/', AdminRouter.getAllUsers);
// Lấy người dùng theo ID
router.get('/:id', AdminRouter.getUserById);
// Tạo người dùng mới
router.post('/', AdminRouter.createUser);
// Cập nhật người dùng
router.put('/:id', AdminRouter.updateUser);
// Xóa người dùng
router.delete('/:id', AdminRouter.deleteUser);

// quan ly hang muc
router.post('/categories', AdminRouter.createCategory);
router.get('/categories', AdminRouter.getAllCategories);
router.get('/categories/:id', AdminRouter.getCategoryById);
router.put('/categories/:id', AdminRouter.updateCategory);
router.delete('/categories/:id', AdminRouter.deleteCategory);

router.post('/items', ItemRouter.createItem);
router.get('/items', ItemRouter.getAllItems);
router.get('/items/:item_id', ItemRouter.getItemById);
router.put('/items/:item_id', ItemRouter.updateItem);
router.delete('/items/:item_id', ItemRouter.deleteItem);

module.exports = router;
