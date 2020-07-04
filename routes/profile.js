var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware"); // auto imports index.js
var gamificate = require("gamificate-js")


router.get("/profile", middleware.isLoggedIn, (req, res) => {
    gamificate.getUser(req.user.gamificate_id).then(response => {
        res.render("profile/profile.ejs", { user: response })
    })
});

router.get("/profile/badges", middleware.isLoggedIn, (req, res) => {

    gamificate.getUserBadgesProgress(req.user.gamificate_id).then( response => {
        let count = 0
        if(response.user_badges.length === 0) {
            res.render("profile/badges.ejs", { finished_badges: finished_badges, unfinished_badges: unfinished_badges })
        }
        let user_badges = []
        response.user_badges.forEach(badge =>  {
            gamificate.getBadge(badge.id_badge).then(b => {
                user_badges.push({...b,  ...badge})
                count++;
                if (count === response.user_badges.length) {
                    const finished_badges = user_badges.filter(badge => badge.finished)
                    const unfinished_badges = user_badges.filter(badge => !badge.finished)
                    res.render("profile/badges.ejs", { finished_badges: finished_badges, unfinished_badges: unfinished_badges })
                }
            })
        })
    })
});


module.exports = router;