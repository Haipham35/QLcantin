const Orders = require('../models/Orders');
const { Op } = require('sequelize');
const { startOfMonth, endOfMonth } = require('date-fns');
const jwt = require('jsonwebtoken')

const thongKeUser = async (req, res) => {
    try {
        // Lấy thông tin `user_id` từ token đã xác thực
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Tìm tổng chi tiêu của người dùng
        const totalSpending = await Orders.sum('total_amount', {
            where: {
                user_id: user.user_id,
                status: {
                    [Op.like]: 'Xác nhận%'
                }
            }
        });

        const totalDebt = await Orders.sum('total_amount', {
            where: {
                user_id: user.user_id,
                status: 'Xác nhận - Ghi No'
            }
        });
        res.json({
            message: 'Thống kê thành công!',
            data: {
                totalSpending: totalSpending || 0,
                totalDebt: totalDebt || 0
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi thống kê dữ liệu' });
    }
};
const thongKeTheoThang = async (req, res) => {
    
    try {
        const { month, year } = req.body; // Nhận tham số month và year từ body

        // Lấy thông tin `user_id` từ token đã xác thực
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Kiểm tra tháng và năm hợp lệ
        if (!year || !month) {
            return res.status(400).json({ error: 'Cần truyền vào year và month' });
        }
      
          // Đảm bảo month là số từ 1 đến 12
        if (month < 1 || month > 12) {
        return res.status(400).json({ error: 'Tháng phải trong phạm vi từ 1 đến 12' });
        }
      
          // Tạo ngày đầu tháng và ngày cuối tháng từ year và month
          const startOfMonthDate = startOfMonth(new Date(year, month - 1, 1)); 
          const endOfMonthDate = endOfMonth(new Date(year, month - 1, 1));

        // Tính tổng chi tiêu của người dùng trong tháng và năm cụ thể
        const totalSpending = await Orders.sum('total_amount', {
            where: {
                user_id: user.user_id,
                status: {
                    [Op.like]: 'Xác nhận%' // Chỉ tính các đơn đã xác nhận
                },
                created_at: {
                    [Op.gte]: startOfMonthDate, // Bắt đầu từ ngày 1 tháng
                    [Op.lt]: endOfMonthDate, // Trước ngày 1 của tháng tiếp theo
                }
            }
        });

        // Tính tổng nợ của người dùng trong tháng và năm cụ thể
        const totalDebt = await Orders.sum('total_amount', {
            where: {
                user_id: user.user_id,
                status: 'Xác nhận - Ghi No',
                created_at: {
                    [Op.gte]: startOfMonthDate, 
                    [Op.lt]: endOfMonthDate, 
                }
            }
        });

        res.json({
            message: 'Thống kê theo tháng thành công!',
            data: {
                month: month,
                year: year,
                totalSpending: totalSpending || 0,
                totalDebt: totalDebt || 0
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Có lỗi xảy ra khi thống kê dữ liệu theo tháng' });
    }
};

module.exports = {
    thongKeUser,
    thongKeTheoThang
};
