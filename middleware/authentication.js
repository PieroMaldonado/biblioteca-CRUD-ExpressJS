const ifNotLoggedin = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.render('auth/login-register');
    }
    next();
}
const ifLoggedin = (req,res,next) => {
    if(req.session.isLoggedIn){
        return res.redirect('auth/home');
    }
    next();
}

module.exports = {
    ifNotLoggedin,
    ifLoggedin
}