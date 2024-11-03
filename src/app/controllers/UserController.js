const  Orders = require('../models/Orders');
const  OrderItems  = require('../models/Orders_items');
const Users = require('../models/Users');
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

module.exports = {
    cancelOrder, getUserInfo
};