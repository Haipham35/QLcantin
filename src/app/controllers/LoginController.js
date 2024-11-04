const Users = require("../models/Users");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const login = async (req,res,next) => {
    try{
    const {username, password} = req.body;
    console.log('Finding user...');

    const user = await Users.findOne({where: {username: username}})
    console.log('User found:', user);
    if (!user) {
        return res.status(401).json({ message: 'Username or password is incorrect' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Username or password is incorrect' });
    }

    // Tạo JWT token
    const token = jwt.sign(
        {   user_id: user.user_id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            phone_number: user.phone_number,
            role: user.role,
            createdAt: user.createdAt },
        'black myth: wukong', // Thay thế bằng secret của bạn, lưu ý không để lộ
        { expiresIn: '1h' }
    );
    const decoded = jwt.decode(token);
    console.log('Decoded Token:', decoded);

    // Trả về token và thông tin người dùng
    res.json({ token, user: { username: user.username, user_id: user.user_id, role: user.role } });
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Something went wrong...'})
        // next();
    }
     
}
const lo = async (req,res) => {
    // Logout
    await req.session.destroy(() => {
        res.redirect('/');
    });
};

module.exports = {login,lo};