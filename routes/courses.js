var express = require("express");
var router = express.Router();
var middleware = require("../middleware"); // auto imports index.js 


// INDEX - List of all courses
router.get("/courses", function(req, res){
    res.render("courses/index.ejs");
});

router.get("/courses/1", middleware.isLoggedIn, function(req, res){
    res.render("courses/show.ejs");
});

module.exports = router;