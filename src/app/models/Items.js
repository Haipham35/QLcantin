const { DataTypes } = require('sequelize');
const sequelize = require('./qlcantin'); 
const Categories = require('./Categories');

const Items = sequelize.define('Items', {
  item_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(50, 2), // Sequelize su dung DECIMAL thay  NUMERIC
    allowNull: false,
  },
  available_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.UUID,
    references: {
      model: 'categories',
      key: 'category_id',
    },
    onDelete: 'SET NULL',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  schema: 'public',
  timestamps: true, 
  tableName: 'items',
});
Items.belongsTo(Categories, { foreignKey: 'category_id', onDelete: 'SET NULL' });
Categories.hasMany(Items, { foreignKey: 'category_id' });

module.exports = Items;
