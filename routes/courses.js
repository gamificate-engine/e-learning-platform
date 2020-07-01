var express = require("express");
var router = express.Router();
var Course = require("../models/course");
var middleware = require("../middleware"); // auto imports index.js 

// INDEX - List of all courses
router.get("/courses", middleware.isLoggedIn, (req, res) => {
    Course.find({}, (error, courses) => {
        if (error) console.log(error)
        else {
            res.render("courses/index.ejs", {courses: courses});
        }
    })
});


router.get("/courses/new", middleware.isTeacherLoggedIn, (req, res) => {
    res.render("courses/new.ejs");
});


router.get("/courses/:id", middleware.isLoggedIn, (req, res) => {
    const id_course = req.params.id;

    Course.findById(id_course, (error, course) => {
        if(error || !course){
            console.log("Error finding object on DB.");
            req.flash("error", "Course not found");
            res.redirect("/courses");
        }
        else{
            res.render("courses/show.ejs", { course: course });
        }
    })
});


router.post("/courses", middleware.isLoggedIn, (req, res) => {
    // get data from form
    const name = req.body.name;

    const new_course = { name: name }

    Course.create(new_course, (error, course) => {
        if(error){
            console.log(error);
        } else {
            console.log(course);
            req.flash("sucess", "Course added successfully");
            res.redirect("/courses");
        }
    })
});




module.exports = router;