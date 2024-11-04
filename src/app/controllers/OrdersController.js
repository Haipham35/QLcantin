const  Orders = require('../models/Orders');
const  OrderItems  = require('../models/Orders_items');
const  Items  = require('../models/Items');
const { Categories } = require('../models/Categories');
const { Users } = require('../models/Users');

// Tạo đơn hàng mới
const createOrder = async (req, res) => {// khi tao bang admin van chua chyen duoc trang thai????
    const { user_id, items, status } = req.body;
    const role = req.session.authUser ? req.session.authUser.permission : 'user';
    console.log('Role:', role);
    console.log('Status from request:', status);
    try {
      let confirmstatus=''
      if (role === 'admin') {
        console.log('Admin role detected');

        console.log(confirmstatus);
        console.log('Status being checked:', status);
        console.log('Is status valid?', ['Ghi No', 'Da Thanh Toan'].includes(status));
            if (['Ghi No', 'Da Thanh Toan'].includes(status)) {
              confirmstatus = `Xác nhận - ${status}`;;
            }else{
              console.log('Status is invalid for admin:', status);
              return res.status(400).json({ error: 'Trạng thái đơn hàng không hợp lệ.' });
            }
            
      }else{
         confirmstatus = 'Chưa xác nhận';
      }
      
      console.log('Final confirm status:', confirmstatus);

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
        status: confirmstatus,
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
//khi xoa hoa don chua xac nhan thi so luong hang ko bị giam di
//mng dung chi cancle đuoc don hang khi admin chua xác nhận
const updateOrder = async (req, res) => {
  const { order_id } = req.params;
  const { items } = req.body; // Danh sách các mặt hàng với số lượng mới

  try {
      const order = await Orders.findByPk(order_id);
      if (!order) {
          return res.status(404).json({ error: `Đơn hàng với ID ${order_id} không tồn tại.` });
      }

      if (order.status.startsWith('Xác nhận')) {
          return res.status(400).json({ error: 'Đơn hàng đã được xác nhận và không thể chỉnh sửa.' });
      }

      let totalAmount = 0;

      // Duyệt qua từng mặt hàng để cập nhật
      for (let item of items) {
          const orderItem = await OrderItems.findOne({ 
              where: { order_id: order_id, item_id: item.item_id }
          });

          if (!orderItem) {
              return res.status(404).json({ error: `Mặt hàng với ID ${item.item_id} không tồn tại trong đơn hàng.` });
          }

          const itemData = await Items.findByPk(item.item_id);
          if (!itemData) {
              return res.status(404).json({ error: `Mặt hàng với ID ${item.item_id} không tồn tại trong kho.` });
          }

          // Cập nhật số lượng tồn kho
          if (item.item_id !== orderItem.item_id) {
              // Phục hồi tồn kho cho mặt hàng cũ
              const oldItemData = await Items.findByPk(orderItem.item_id);
              await oldItemData.update({
                  available_quantity: oldItemData.available_quantity + orderItem.quantity,
              });
              if (item.quantity > itemData.available_quantity) {
                  return res.status(400).json({ error: `Số lượng tồn kho không đủ cho mặt hàng ${itemData.name}.` });
              }

              await itemData.update({
                  available_quantity: itemData.available_quantity - item.quantity,
              });

              // Cập nhật thông tin mặt hàng trong đơn hàng
              await orderItem.update({
                  item_id: item.item_id,
                  quantity: item.quantity,
                  price: itemData.price, // Cập nhật giá mới nếu có
              });
          } else {
              await itemData.update({
                  available_quantity: itemData.available_quantity - (item.quantity - orderItem.quantity),
              });
              // Cập nhật số lượng trong đơn hàng
              await orderItem.update({ quantity: item.quantity });
          }
          totalAmount += itemData.price * item.quantity;
      }
      // Cập nhật tổng số tiền cho đơn hàng
      await order.update({ total_amount: totalAmount });

      res.json({ message: 'Đơn hàng đã được cập nhật thành công!', order });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật đơn hàng.' });
  }
};
const cancelOrder = async (req, res) => {
  const { order_id } = req.params;

  try {
      const order = await Orders.findByPk(order_id);
      if (!order) {
          return res.status(404).json({ error: `Đơn hàng với ID ${order_id} không tồn tại.` });
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

module.exports = {
    createOrder,
    confirmOrder,
    updateOrder,
    cancelOrder,

    
};