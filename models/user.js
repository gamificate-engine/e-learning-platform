const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    gamificate_id: Number,
    isTeacher: {type: Boolean, default: false}
});

// import methods
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);