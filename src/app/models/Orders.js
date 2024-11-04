const { DataTypes } = require('sequelize');
const sequelize = require('./connect/db'); 
const Users = require('./Users'); 
const OrderItems = require('./Orders_items');
const Items = require('./Items');

const Orders = sequelize.define('Orders', {
  order_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users', 
      key: 'user_id', 
    },
    onDelete: 'CASCADE', 
  },
  total_amount: {
    type: DataTypes.DECIMAL(50, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'Chưa xác nhận',
    validate: {
        isIn: [['Chưa xác nhận', 'Xác nhận - Ghi No', 'Xác nhận - Da Thanh Toan', 'Huy']],
    },
},
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

}, {
  schema: 'public',
  timestamps: true, 
  createdAt: 'created_at', // Đổi tên cột createdAt thành created_at
  updatedAt: 'updated_at', // Đổi tên cột updatedAt thành updated_at
  tableName: 'orders', 
});

Orders.belongsTo(Users, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Orders.hasMany(OrderItems, { foreignKey: 'order_id', onDelete: 'CASCADE' }); // Quan hệ 1-n với Order_items
OrderItems.belongsTo(Orders, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItems.belongsTo(Items, { foreignKey: 'item_id' });

module.exports = Orders;