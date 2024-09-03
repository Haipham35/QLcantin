const adminRouter = require('./admin')
const userRouter = require('./user')
function route(app) {
    app.use('/user/api/', userRouter)

    app.use('/admin/api/', adminRouter)
}

module.exports = route