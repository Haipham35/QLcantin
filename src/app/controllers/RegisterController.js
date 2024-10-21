const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = 'black myth: wukong';

const register = async (req, res) => {
    const { username, password, full_name, email, phone_number } = req.body;
    if (!username ||!password ||!full_name ||!email||!phone_number) {
      return res.status(400).json({ message: 'Yêu cầu nhập đầy đu thông tin' });
    }
    console.log('Creating user...',{ username, password, full_name, email, phone_number });
    try {
      // Kiểm tra xem username hoặc email đã tồn tại chưa
      const existingUser = await Users.findOne({ where: { username } });
      const existingEmail = await Users.findOne({ where: { email } });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Username đã tồn tại' });
      }
      if (existingEmail) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }
  
      // Tạo người dùng mới
      const newUser = await Users.create({
        username,
        password,
        full_name,
        email,
        phone_number,
      });
  
      // Tạo token JWT
      const token = jwt.sign({ id: newUser.user_id, username: newUser.username, role: newUser.role }, SECRET_KEY, { expiresIn: '1h' });
  
      res.status(201).json({
        message: 'Đăng ký thành công',
        user: {
          id: newUser.user_id,
          username: newUser.username,
          full_name: newUser.full_name,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Có l��i xảy ra khi đăng ký' });
    }
  };
  
  module.exports = { register };