const { DataTypes } = require('sequelize');
const sequelize = require('./connect/db'); 

const Categories = sequelize.define('Categories', {
  category_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  schema: 'public',
  timestamps: false,
  tableName: 'categories',
});

// Create a new category
Categories.createCategory = async function(CategoriesData) {
  const { name, description } = CategoriesData;
  try {
    const newCategory = await Categories.create(CategoriesData);
    return newCategory;
  } catch (error) {
    console.log(error);
    res.status(500).json('Something went wrong...');
  }
};

// Get all categories
Categories.getAllCategories = async (req, res) => {
  try {
    const categories = await Categories.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json('Something went wrong...');
  }
};

// Get a category by ID
Categories.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categories.findByPk(id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Something went wrong...');
  }
};

// Update a category by ID
Categories.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const [updated] = await Categories.update({ name, description }, {
      where: { category_id: id }
    });
    if (updated) {
      const updatedCategory = await Categories.findByPk(id);
      res.status(200).json(updatedCategory);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Something went wrong...');
  }
};

// Delete a category by ID
Categories.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Categories.destroy({
      where: { category_id: id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json('Something went wrong...');
  }
};

module.exports = Categories;
