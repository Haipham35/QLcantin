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
      model: 'orders', 
      key: 'order_id',
    },
    onDelete: 'CASCADE', 
  },
  item_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'items', 
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


Order_items.belongsTo(Orders, { foreignKey: 'order_id', onDelete: 'CASCADE' });
Order_items.belongsTo(Items, { foreignKey: 'item_id' });

module.exports = Order_items;
