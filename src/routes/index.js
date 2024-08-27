const adminRouter = require('./admin')
function route(app) {
    // app.use('/user/api/', userRouter)

    app.use('/admin/api/', adminRouter)
}

module.exports = route