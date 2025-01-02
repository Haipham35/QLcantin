const  Orders = require('../models/Orders');
const  OrderItems  = require('../models/Orders_items');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const cancelOrder = async (req, res) => {
    const { order_id } = req.params;
  
    try {
        const order = await Orders.findByPk(order_id);
        if (!order) {
            return res.status(404).json({ error: `Đơn hàng với ID ${order_id} không tồn tại.` });
        }
        if (order.status.startsWith('Xác nhận')) {
            return res.status(400).json({ error: 'Đơn hàng đã được xác nhận và không thể hủy.' });
        }
        if (order.status === 'Huy') {
            return res.status(400).json({ error: 'Đơn hàng đã bị hủy trước đó.' });
        }
  
        // Lấy các mặt hàng trong đơn hàng
        const orderItems = await OrderItems.findAll({ where: { order_id: order_id } });
  
        // Hoàn lại số lượng tồn kho của từng mặt hàng
        for (let orderItem of orderItems) {
            const itemData = await Items.findByPk(orderItem.item_id);
            if (itemData) {
                await itemData.update({
                    available_quantity: itemData.available_quantity + orderItem.quantity,
                });
            }
        }
  
        // Cập nhật trạng thái của đơn hàng thành 'Hủy'
        await order.update({ status: 'Huy' });
  
        res.json({ message: 'Đơn hàng đã được hủy thành công!', order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi hủy đơn hàng.' });
    }
};
const getUserInfo = async (req, res) => {
    try {
      // Lấy thông tin người dùng từ token đã xác thực
      
      const user = req.user ;
      console.log('user get for:', user);
      if (!user) {
        return res.status(404).json({ error: 'Người dùng không tồn tại' });
      }
      
      // Trả về thông tin cá nhân
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Có lỗi xảy ra khi lấy thông tin người dùng' });
    }
  };
const updateUser = async (req, res) => {
    const updatedData = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const decoded = jwt.decode(token, 'black myth: wukong');
    let userId = decoded.user_id;
    console.log('user_id:', userId);

    try { 
        const existingUser = await Users.findByPk(userId);
        if (updatedData.username && updatedData.username !== existingUser.username) {
            const userWithSameUsername = await Users.findOne({ where: { username: updatedData.username } });
            if (userWithSameUsername) {
              return res.status(400).json({ error: 'Ten dang nhap da ton tai' });
            }
        }
        if (!existingUser) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Chỉ cho phép cập nhật full_name, email, phone_number, và password
        existingUser.username = updatedData.username || existingUser.username;
        existingUser.full_name = updatedData.full_name || existingUser.full_name;
        existingUser.email = updatedData.email || existingUser.email;
        existingUser.phone_number = updatedData.phone_number || existingUser.phone_number;
    
        await existingUser.save();
        const updatedUserData = {
            user_id: existingUser.user_id,
            username: existingUser.username,
            full_name: existingUser.full_name,
            email: existingUser.email,
            phone_number: existingUser.phone_number,
            role: existingUser.role
        };
        
        const newToken = jwt.sign(updatedUserData, 'black myth: wukong', { expiresIn: '1h' });
        
        
        res.status(201).json({ 
            message: 'User updated successfully kem new token', 
            token: newToken 
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong...' });
      }


};
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const decoded = jwt.decode(token, 'black myth: wukong');
    let userId = decoded.user_id;
    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await Users.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Kiểm tra mật khẩu hiện tại
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Mã hoá mật khẩu mới và lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // console.log('Hashed change Password:', hashedPassword);

        // Cập nhật trong DB
        user.password = hashedPassword;
        // console.log('Before save - User Password:', user.password);
        await user.save();
        // console.log('Before save - User Password:', user.password);

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong...' });
    }

};
module.exports = {
    cancelOrder, getUserInfo, updateUser, changePassword,
};