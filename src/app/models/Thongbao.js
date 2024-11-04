const { DataTypes } = require('sequelize');
const sequelize = require('./connect/db'); 
const CircularJSON = require('circular-json');

const ThongBao = sequelize.define('ThongBao', {
  idthongbao: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    field: 'idthongbao',
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
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});


// Create a new ThongBao
ThongBao.createThongBao = async (req,res) => {
  const { noidung } = req.body;
  try {
    const newThongBao = await ThongBao.create({ noidung });
    res.status(201).json(newThongBao);
  } catch (error) {
    console.error('Error details:', error); 
    throw new Error('Failed to create ThongBao');
  }
};

// Get all ThongBaos
ThongBao.getAllThongBaos = async (req,res) => {
  try {
    const thongBaos = await ThongBao.findAll();
    res.status(200).json(thongBaos);
  } catch (error) {
    console.log('Error details:', error);
    throw new Error('Failed to get ThongBaos');
  }
};

// Get a ThongBao by ID
ThongBao.getThongBaoById = async (req,res) => {
  const { idthongbao } = req.params;
  try {
    const thongBao = await ThongBao.findByPk(idthongbao);
    if (!thongBao) {
      return res.status(404).json({ error: 'Khong co thong bao' });
    }

    res.status(200).json(thongBao);
    return thongBao;
  } catch (error) {
    throw new Error('Failed to get ThongBao');
  }
};

// Update a ThongBao by ID
ThongBao.updateThongBaoById = async (req,res) => {
  const { idthongbao } = req.params;
  const { noidung } = req.body;
  try {
    const thongBao = await ThongBao.findByPk(idthongbao);
    if (!thongBao) {
      throw new Error('ThongBao not found');
    }
    thongBao.noidung = noidung;
    await thongBao.save();
    res.status(200).json(thongBao);
  } catch (error) {
    throw new Error('Failed to update ThongBao');
  }
};

// Delete a ThongBao by ID
ThongBao.deleteThongBaoById = async (req,res) => {
  const { idthongbao } = req.params;
  try {
    const thongBao = await ThongBao.findByPk(idthongbao);
    if (!thongBao) {
      throw new Error('ThongBao not found');
    }
    await thongBao.destroy();
    res.status(204).send({message: 'Delete complete!!!'})
  } catch (error) {
    throw new Error('Failed to delete ThongBao');
  }
};


module.exports = ThongBao;
