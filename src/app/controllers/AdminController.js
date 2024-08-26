const Users = require('../models/Users');

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy người dùng theo ID
const getUserById = async (req, res) => {
  try {
    const user = await Users.findUserById(req.params.id); //lưu y 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo người dùng mới
const createUser = async (req, res) => {//xem lai
//   const {  ...rest } = req.body;
  const { username, password, full_name, email, role = 'user' } = req.body;
  if (!username ||!password ||!full_name ||!email ) {
      return res.status(400).json({ error: 'Yeu cau nhap du thong tin' });
  }
  try {
    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Ten dang nhap da ton tai' });
    }
    const newUser = await Users.createUser({ username, password, full_name, email, role,  });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật người dùng
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  try { 
    const existingUser = await Users.findByPk(userId);
    if (updatedData.username && updatedData.username !== existingUser.username) {
        const userWithSameUsername = await Users.findOne({ where: { username: updatedData.username } });
        if (userWithSameUsername) {
          return res.status(400).json({ error: 'Ten dang nhap da ton tai' });
        }
    }
    //them route password rieng
    existingUser.username = updatedData.username || existingUser.username;
    existingUser.password = updatedData.password || existingUser.password;
    existingUser.full_name = updatedData.full_name || existingUser.full_name;
    existingUser.email = updatedData.email || existingUser.email;
    existingUser.phone_number = updatedData.phone_number || existingUser.phone_number;
    await existingUser.save();
    
    // const updatedUser = await Users.findByPk(userId);
    res.status(201).json({ message: 'Updated'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    await Users.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};