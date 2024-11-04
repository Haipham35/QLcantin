const { DataTypes } = require('sequelize');
const sequelize = require('./connect/db'); 
const Orders = require('./Orders'); 
const Items = require('./Items');

const Order_items = sequelize.define('Order_items', {
  order_item_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Orders', 
      key: 'order_id',
    },
    onDelete: 'CASCADE', 
  },
  item_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Items', 
      key: 'item_id', 
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(50, 2),
    allowNull: false,
  },
}, {
  schema: 'public',
  timestamps: false, 
  tableName: 'order_items', 
});



module.exports = Order_items;