var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware"); // auto imports index.js


router.get("/profile", middleware.isLoggedIn, (req, res) => {
    if (!req.user.isTeacher) {
        gamificate.getUser(req.user.gamificate_id).then(response => {
            res.render("profile/profile.ejs", { user: response })
        })
    }
    else {
        gamificate_teachers.getUser(req.user.gamificate_id).then(response => {
            res.render("profile/profile.ejs", { user: response })
        })
    }

});

router.get("/profile/badges", middleware.isLoggedIn, (req, res) => {
    if (!req.user.isTeacher) {
        gamificate.getUserBadgesProgress(req.user.gamificate_id).then( response => {
            let count = 0
            let finished_badges = []
            let unfinished_badges = []

            if(response.user_badges.length === 0) {
                res.render("profile/badges.ejs", { finished_badges: finished_badges, unfinished_badges: unfinished_badges })
            }
            let user_badges = []
            response.user_badges.forEach(badge =>  {
                gamificate.getBadge(badge.id_badge).then(b => {
                    user_badges.push({...b,  ...badge})
                    count++;
                    if (count === response.user_badges.length) {
                        finished_badges = user_badges.filter(badge => badge.finished)
                        unfinished_badges = user_badges.filter(badge => !badge.finished)
                        res.render("profile/badges.ejs", { finished_badges: finished_badges, unfinished_badges: unfinished_badges })
                    }
                })
            })
        })
    }
    else {
        gamificate_teachers.getUserBadgesProgress(req.user.gamificate_id).then( response => {
            let count = 0
            let finished_badges = []
            let unfinished_badges = []

            if(response.user_badges.length === 0) {
                res.render("profile/badges.ejs", { finished_badges: finished_badges, unfinished_badges: unfinished_badges })
            }
            let user_badges = []
            response.user_badges.forEach(badge =>  {
                gamificate_teachers.getBadge(badge.id_badge).then(b => {
                    user_badges.push({...b,  ...badge})
                    count++;
                    if (count === response.user_badges.length) {
                        finished_badges = user_badges.filter(badge => badge.finished)
                        unfinished_badges = user_badges.filter(badge => !badge.finished)
                        res.render("profile/badges.ejs", { finished_badges: finished_badges, unfinished_badges: unfinished_badges })
                    }
                })
            })
        })
    }
});


module.exports = router;