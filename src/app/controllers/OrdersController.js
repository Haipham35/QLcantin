const  Orders = require('../models/Orders');
const  OrderItems  = require('../models/Orders_items');
const  Items  = require('../models/Items');
const { Categories } = require('../models/Categories');

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
    const { user_id, items, order_status } = req.body;
    const role = req.session.authUser ? req.session.authUser.permission : 'user';  
    try {
      let confirmation_status = 'Chưa xác nhận';
      let status = 'Ghi No';
      if (role === 'admin') {
        confirmation_status = 'Xác nhận';
        if (['Ghi No', 'Da Thanh Toan'].includes(order_status)) {// nghi action chuyeenr trang thai
            status = order_status;
        }
      }
  
      // Tính tổng số tiền đơn hàng
      let totalAmount = 0;
  
      for (let item of items) {
        const itemData = await Items.findByPk(item.item_id);
        console.log(itemData);
        if (!itemData) {
          return res.status(404).json({ error: `Item với ID ${item.item_id} không tồn tại.` });
        }
  
        if (item.quantity > itemData.available_quantity) {
          return res.status(400).json({ error: `Số lượng tồn kho không đủ cho item ${itemData.name}.` });
        }
  
        totalAmount += itemData.price * item.quantity;
      }
  
      const newOrder = await Orders.create({
        user_id,
        total_amount: totalAmount,
        order_status: status,
        confirmation_status,// sua lai
      });
  
      for (let item of items) {
        const itemData = await Items.findByPk(item.item_id);
  
        await OrderItems.create({
          order_id: newOrder.order_id,
          item_id: item.item_id,
          quantity: item.quantity,
          price: itemData.price,
        });
  
        await itemData.update({
          available_quantity: itemData.available_quantity - item.quantity,
        });
      }
  
      res.status(201).json({ message: 'Đơn hàng đã được tạo thành công!', order: newOrder });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Có loi xảy ra khi tạo đơn hàng.' }); 
    }
};
//Confirm the order
const confirmOrder = async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body; // Lấy trạng thái thanh toán từ request body (có thể là 'Ghi No' hoặc 'Da Thanh Toan')

  try {
      const order = await Orders.findByPk(order_id);
      if (!order) {
          return res.status(404).json({ error: `Đơn hàng với ID ${order_id} không tồn tại.` });
      }

      if (order.status.startsWith('Xác nhận')) {
          return res.status(400).json({ error: 'Đơn hàng đã được xác nhận trước đó.' });
      }

      if (order.status !== 'Chưa xác nhận') {
          return res.status(400).json({ error: 'Trạng thái hiện tại của đơn hàng không hợp lệ để xác nhận.' });
      }

      // Xác định trạng thái mới sau khi xác nhận
      let newStatus = '';
      if (['Ghi No', 'Da Thanh Toan'].includes(status)) {
          newStatus = `Xác nhận - ${status}`;
      } else {
          return res.status(400).json({ error: 'Trạng thái thanh toán không hợp lệ.' });
      }

      await order.update({ status: newStatus });

      res.json({ message: 'Đơn hàng đã được xác nhận thành công!', order });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Có lỗi xảy ra khi xác nhận đơn hàng.' });
  }
};

module.exports = {
    createOrder,
    confirmOrder,
};