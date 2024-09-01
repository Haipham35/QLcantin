const Users = require("../models/Users");


const login = async (req,res,next) => {
    try{
    const {username, password} = req.body;

    const user = await Users.findOne({where: {username: username}})

    if (user) {
        // So sánh mật khẩu người dùng nhập với mật khẩu đã băm lưu trong cơ sở dữ liệu
        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            // Xóa mật khẩu khỏi đối tượng user để bảo mật
            user.password = null
            // Đặt session
            req.session.isAuthenticated = true;
            req.session.authUser = user;

            // Điều hướng dựa trên quyền hạn của người dùng
            if (req.session.authUser.permission === "user") {
                res.redirect('/user/');
            } else if (req.session.authUser.permission === "admin") {
                res.redirect('/admin/');
            }
        } else {
            res.send('Email hoặc mật khẩu không chính xác');
        }
    } else {
        res.send('Email hoặc mật khẩu không chính xác');
    }
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Something went wrong...'})
        next();
    }
     
}
const lo = async (req,res) => {
    // Logout
    await req.session.destroy(() => {
        res.redirect('/');
    });
};
s
module.exports = {login,lo};