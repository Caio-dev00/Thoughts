    module.exports.checkAuth = function (req, res, next) {
        const userId = req.session.userId

        if(!userId) {
            res.redirect('/login')
        }

        next()
    }