const { DataTypes } = require('sequelize');
const sequelize = require('./connect/db'); 

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


// Create a new ThongBao
ThongBao.createThongBao = async (noidung) => {
  try {
    const thongBao = await ThongBao.create({ noidung });
    return thongBao;
  } catch (error) {
    throw new Error('Failed to create ThongBao');
  }
};

// Get all ThongBaos
ThongBao.getAllThongBaos = async () => {
  try {
    const thongBaos = await ThongBao.findAll();
    return thongBaos;
  } catch (error) {
    throw new Error('Failed to get ThongBaos');
  }
};

// Get a ThongBao by ID
ThongBao.getThongBaoById = async (id) => {
  try {
    const thongBao = await ThongBao.findByPk(id);
    return thongBao;
  } catch (error) {
    throw new Error('Failed to get ThongBao');
  }
};

// Update a ThongBao by ID
ThongBao.updateThongBaoById = async (id, noidung) => {
  try {
    const thongBao = await ThongBao.findByPk(id);
    if (!thongBao) {
      throw new Error('ThongBao not found');
    }
    thongBao.noidung = noidung;
    await thongBao.save();
    return thongBao;
  } catch (error) {
    throw new Error('Failed to update ThongBao');
  }
};

// Delete a ThongBao by ID
ThongBao.deleteThongBaoById = async (id) => {
  try {
    const thongBao = await ThongBao.findByPk(id);
    if (!thongBao) {
      throw new Error('ThongBao not found');
    }
    await thongBao.destroy();
    return thongBao;
  } catch (error) {
    throw new Error('Failed to delete ThongBao');
  }
};


module.exports = ThongBao;
