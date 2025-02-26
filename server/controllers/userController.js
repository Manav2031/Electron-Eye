const express=require('express')
const router=express.Router()
const User=require('../models/usermodel.js')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


//REGISTER

exports.userRegister = async (req, res) => {
    try {
        const { username, password, labId } = req.body;

        // Validate required fields
        if (!username || !password || !labId) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check for duplicate entries
        const existingUser = await User.findOne({ $or: [{ username }, { labId }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or LabId already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new User({ username, labId, password: hashedPassword });
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



//LOGIN
exports.userLogin = async (req, res) => {
    try{
        const user=await User.findOne({username:req.body.username})
       
        if(!user){
            return res.status(404).json("User not found!")
        }
        const match=await bcrypt.compare(req.body.password,user.password)
        
        if(!match){
            return res.status(401).json("Wrong credentials!")
        }
        const token=jwt.sign({_id:user._id,username:user.username,labId:user.labId},process.env.SECRET,{expiresIn:"3d"})
        const {password,...info}=user._doc
        res.cookie("token",token).status(200).json(info)

    }
    catch(err){
        res.status(500).json(err)
    }
}



//LOGOUT
exports.userLogout = async (req, res) => {
    try{
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).send("User logged out successfully!")

    }
    catch(err){
        res.status(500).json(err)
    }
}

//REFETCH USER
exports.userRefetch = async (req, res) => {
    const token=req.cookies.token
    jwt.verify(token,process.env.SECRET,{},async (err,data)=>{
        if(err){
            return res.status(404).json(err)
        }
        console.log("Decoded JWT data:", data);
        res.status(200).json(data)
    })
}

