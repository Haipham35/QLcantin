const { DataTypes } = require('sequelize');
const sequelize = require('./qlcantin'); 
const Users = require('./Users'); 

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
  order_status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      isIn: [['Ghi No', 'Da Thanh Toan', 'canceled']], // Ràng buộc giá trị
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  schema: 'public',
  timestamps: true, 
  tableName: 'orders', 
});

Orders.belongsTo(Users, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = Orders;
