const { DataTypes, UUIDV4 } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('./connect/db'); // ket noi db


const Users = sequelize.define('Users', {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  phone_number: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  role: {
    type: DataTypes.CHAR,
    allowNull: false,
    validate: {
      isIn: [['admin', 'user']],
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
  tableName: 'users',
  hooks: {
    beforeCreate: async (users) => {
      if (users.password) {
        const salt = await bcrypt.genSalt(10); 
        users.password = await bcrypt.hash(users.password, salt); // Hash pass
      }
    },
    beforeUpdate: async (users) => {
      if (users.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        users.password = await bcrypt.hash(users.password, salt);
      }
    }
  }
});

//  so sánh pass da hash vs pass nguoi dung nhap
Users.prototype.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Tìm người dùng bằng ID
Users.findUserById = async function(userId) {
  try {
    const user = await this.findByPk(userId);
    return user;
  } catch (error) {
    throw new Error('Error finding user by ID');
  }
};

// Tạo người dùng mới
Users.createUser = async function(userData) {
  console.log('User data:', userData);
  
  try {
    const newUser = await this.create(userData);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error); // In ra toàn bộ lỗi
    throw new Error(`Error creating user: ${error.message}`); // Trả về chi tiết lỗi
  }
};

// Cập nhật người dùng
Users.updateUser = async function(userId, updateData) {
  try {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const updatedUser = await user.update(updateData);
    return updatedUser;
  } catch (error) {
    throw new Error('Error updating user');
  }
};

// Xóa người dùng
Users.deleteUser = async function(userId) {
  try {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
  } catch (error) {
    throw new Error('Error deleting user');
  }
};

// Lấy tất cả người dùng
Users.getAllUsers = async function() {
  try {
    const users = await this.findAll();
    return users;
  } catch (error) {
    throw new Error('Error fetching users');
  }
};

module.exports = Users;