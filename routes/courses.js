var express = require("express");
var router = express.Router();
var Course = require("../models/course");
var Task = require("../models/task");
var middleware = require("../middleware"); // auto imports index.js 
var gamificate = require("gamificate-js")

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

    Course.findById(id_course).populate("tasks").populate("students").exec((error, course) => {
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


router.post("/courses/:id", middleware.isLoggedIn, (req, res) => {
    const id_course = req.params.id;

    Course.findById(id_course, (error, course) => {
        if(error || !course) {
            console.log("Error finding object on DB.");
            req.flash("error", "Course not found");
            res.redirect("/courses");
        }
        else{
            gamificate.updateUserBadgeProgress(req.user.gamificate_id, 16, 1) //.then(r => console.log(r))
            gamificate.updateUserBadgeProgress(req.user.gamificate_id, 18, 1)
            gamificate.updateUserBadgeProgress(req.user.gamificate_id, 19, 1)
            course.students.push(req.user._id);
            course.save()
            req.flash("success", "Enrolled in course!");
            res.redirect("/courses/" + course._id);
        }
    })
});


router.get("/courses/:id/tasks", middleware.isTeacherLoggedIn, (req, res) => {
    const course_id = req.params.id

    Course.findById(course_id, (error, course) => {
        if (error) {
            console.log("Course not found.")
        } else {
            res.render("courses/tasks/new.ejs", {course: course});
        }
    });
})


router.post("/courses/:id/tasks", middleware.isTeacherLoggedIn, (req, res) => {
    const course_id = req.params.id
    const name = req.body.name;
    const description = req.body.description;

    Course.findById(course_id, (error, course) => {
        if (error) {
            console.log("Course not found.")
        }
        else {
            const new_task = { name: name, description: description }
            Task.create(new_task, (error, task) => {
                if (error) {
                    console.log("Error creating task.")
                }
                else {
                    course.tasks.push(task);
                    course.save();
                    req.flash("success", "Task added successfully.");
                    res.redirect("/courses/" + course._id);
                }
            })
        }
    })
});

router.post("/courses", middleware.isLoggedIn, (req, res) => {
    // get data from form
    const name = req.body.name;
    const owner = {
        id: req.user._id,
        username: req.user.username
    }
    const new_course = { name: name, owner: owner }

    Course.create(new_course, (error, course) => {
        if(error){
            console.log(error);
        } else {
            console.log(course);
            req.flash("success", "Course added successfully");
            res.redirect("/courses");
        }
    })
});


module.exports = router;