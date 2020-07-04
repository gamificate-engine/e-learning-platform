var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var gamificate = require('gamificate-js')

router.get("/", function(req, res){
    res.render("landing.ejs");
});


router.get("/register", function(req, res){
    res.render("register.ejs");
});


router.post("/register", function(req, res){
    const username = req.body.username
    const email = req.body.email

    User.register(new User({username: username, email: email}), req.body.password, function(error, user){
        if(error){
            console.log("Error: " + error);
            return res.render("register.ejs", {error: error.message});            
        }

        gamificate.registerUser(username, email).then( response => {
            const gamificate_user_id = response.id
            user.gamificate_id = gamificate_user_id
            user.save();

            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to Online Courses " + user.username);
                res.redirect("/courses");
            });
        })
    });
});


router.get("/login", function(req, res){
    res.render("login.ejs");
});


router.post("/login", passport.authenticate("local", {
        successRedirect: "/courses",
        failureRedirect: "/login"
    }), function(req, res){
    }
);


router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Signed out successfuly.");
    res.redirect("/courses");
});


module.exports = router;