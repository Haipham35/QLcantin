const { DataTypes } = require('sequelize');
const sequelize = require('./qlcantin'); 

const ThongBao = sequelize.define('ThongBao', {
  idThongBao: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  noidung: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  schema: 'public', // Đặt schema cho model (public nếu bạn sử dụng schema public)
  timestamps: true, 
  tableName: 'thongbao', 
});

module.exports = ThongBao;
