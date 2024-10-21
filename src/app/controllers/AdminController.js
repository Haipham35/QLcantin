const Users = require('../models/Users');
const Categories = require('../models/Categories');


// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await Users.getAllUsers();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong...' });
  }
};

// Lấy người dùng theo ID
const getUserById = async (req, res) => {
  try {
    const user = await Users.findUserById(req.params.id); //lưu y 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong...' });
  }
};

// Tạo người dùng mới
const createUser = async (req, res) => {//xem lai
//   const {  ...rest } = req.body;
  const { username, password, full_name, email, role } = req.body;
  if (!username ||!password ||!full_name ||!email ) {
      return res.status(400).json({ error: 'Yeu cau nhap du thong tin' });
  }
  try {
    const existingUser = await Users.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Ten dang nhap da ton tai' });
    }
    const newUser = await Users.createUser({ username, password, full_name, email, role,  });
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong...' });
  }
};

// Cập nhật người dùng
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  try { 
    const existingUser = await Users.findByPk(userId);
    if (updatedData.username && updatedData.username !== existingUser.username) {
        const userWithSameUsername = await Users.findOne({ where: { username: updatedData.username } });
        if (userWithSameUsername) {
          return res.status(400).json({ error: 'Ten dang nhap da ton tai' });
        }
    }
    //them route password rieng
    existingUser.username = updatedData.username || existingUser.username;
    existingUser.password = updatedData.password || existingUser.password;
    existingUser.full_name = updatedData.full_name || existingUser.full_name;
    existingUser.email = updatedData.email || existingUser.email;
    existingUser.phone_number = updatedData.phone_number || existingUser.phone_number;
    await existingUser.save();
    
    // const updatedUser = await Users.findByPk(userId);
    res.status(201).json({ message: 'Updated'});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong...' });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    await Users.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong...' });
  }
};

// Create a new category
const createCategory = async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    try {
      const newCategory = await Categories.create({ name, description });
      res.status(201).json(newCategory);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Something went wrong...' });
    }
};
  
  // Get all categories
const getAllCategories = async (req, res) => {
    try {
      const categories = await Categories.findAll();
      res.status(200).json(categories);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Something went wrong...' });
    }
};
  
  // Get a category by ID
const getCategoryById = async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Categories.findByPk(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Something went wrong...' });
    }
};
  
  // Update a category by ID
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
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
      res.status(500).json({ error: 'Something went wrong...' });
    }
};
  
  // Delete a category by ID
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await Categories.destroy({
        where: { category_id: id }
      });
      if (deleted) {
        res.status(204).json('Deleted');
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Something went wrong...' });
    }
};






module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};