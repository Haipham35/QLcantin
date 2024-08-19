const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('./qlcantin'); // ket noi db

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
        users.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

//  so sánh pass da hash vs pass nguoi dung nhap
Users.prototype.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = Users;
