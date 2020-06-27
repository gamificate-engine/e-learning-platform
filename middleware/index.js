var obj = {};

obj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first to complete your action.");
    res.redirect("/login");
}

module.exports = obj;