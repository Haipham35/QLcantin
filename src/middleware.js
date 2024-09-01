
module.exports = function restrict(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/user/login')
    }
    if (req.session.isAuthenticated && req.session.authUser.permission === "admin") {
        return res.redirect('/user/login')
    }
    next()
}