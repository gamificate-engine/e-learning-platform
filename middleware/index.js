var obj = {};


obj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first to complete your action.");
    res.redirect("/login");
}


obj.isTeacherLoggedIn = function(req, res, next) {
    if(req.isAuthenticated() && req.user.isTeacher){
        return next();
    }
    req.flash("error", "Please login as Teacher first to complete your action.");
    res.redirect("/login");
}


module.exports = obj;