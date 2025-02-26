const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    labId:{
        type: String,
        required: true,
        unique: true,
    }

});

const usermodel = mongoose.model("User", userSchema);
module.exports=usermodel;