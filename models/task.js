const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    name: String,
    description: String
});

module.exports = mongoose.model("Task", TaskSchema);