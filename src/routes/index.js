const adminRouter = require('./admin')
const userRouter = require('./user')
function route(app) {
    app.use('/user', userRouter)

    app.use('/admin', adminRouter)
}

module.exports = route