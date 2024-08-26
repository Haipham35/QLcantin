const pg = require('pg');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'postgres', 
  host: 'localhost', // Hoặc địa chỉ máy chủ cơ sở dữ liệu của bạn
  port: 5432, // Cổng kết nối (mặc định cho PostgreSQL)
  database: 'qlcantin', // Tên cơ sở dữ liệu của bạn
  username: 'haipham', // Tên người dùng cơ sở dữ liệu của bạn
  password: '123456', // Mật khẩu cơ sở dữ liệu của bạn
});
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
