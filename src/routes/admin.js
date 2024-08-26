// routes/users.js
const express = require('express');
const router = express.Router();
const AdminRouter = require('../app/controllers/AdminController');

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

module.exports = router;
