const { DataTypes } = require('sequelize');
const sequelize = require('./connect/db'); 
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
    allowNull: true,
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
  }
}, {
  schema: 'public',
  timestamps: true, 
  createdAt: 'created_at', // Đổi tên cột createdAt thành created_at
  updatedAt: 'updated_at', // Đổi tên cột updatedAt thành updated_at
  tableName: 'items',
});
Items.belongsTo(Categories, { foreignKey: 'category_id', onDelete: 'SET NULL' });
Categories.hasMany(Items, { foreignKey: 'category_id' });

Items.createItem = async (req, res) => {
  const { name, description, price, available_quantity, category_id } = req.body;

  try {
    if ((category_id === '8f6fe2fb-8d7b-484a-96d9-f307f56e7837' || category_id === 'c9191720-33a2-4990-a295-9aee0867ec86') && (!available_quantity || available_quantity === '')) {
      return res.status(400).json({ error: "available_quantity không được để trống " });
    }
    const newItem = await Items.create({
      name,
      description,
      price,
      available_quantity,
      category_id,
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.log(error);
    res.status(500).json('Something went wrong...');
  }
};
// Lấy tất cả các item
Items.getAllItems = async (req, res) => {
  try {
    const items = await Items.findAll({
      include: Categories, // Tham chiếu đến bảng Categories
    });
    res.status(200).json(items);
  } catch (error) {
    console.log(error);
    res.status(500).json('Something went wrong...');
  }
};

// Lấy một item theo item_id
Items.getItemById = async (req, res) => {
  const { item_id } = req.params;

  try {
    const item = await Items.findByPk(item_id, {
      include: Categories,
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json('Something went wrong...');
  }
};
Items.updateItem = async (req, res) => {
  const { item_id } = req.params;
  const { name, description, price, available_quantity, category_id } = req.body;

  try {
    const item = await Items.findByPk(item_id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.update({
      name: name || item.name,
      description: description || item.description,
      price: price || item.price,
      available_quantity: available_quantity || item.available_quantity,
      category_id: category_id || item.category_id,
    });

    res.status(200).json(item);
  } catch (error) {
    console.log(error);
    res.status(500).json('Something went wrong...');
  }
};
Items.deleteItem = async (req, res) => {
  const { item_id } = req.params;

  try {
    const item = await Items.findByPk(item_id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.destroy();
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.log(error);
    res.status(500).json('Something went wrong...');
  }
};



module.exports = Items;

