const express = require("express")
const path = require("path");
const { upload } = require("../multer");
const router = express.Router();
const User = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");

router.post("/create-user" , upload.single("file"), async (req,res,next) =>{
    const {name,email,password} = req.body;
    const userEmail =  await User.findOne({ email })

    if(userEmail){
        return next(new ErrorHandler("User already exists" , 400))
    }
    const filename = req.file.filename;
    const fileUrl = path.join(filename)

  
    const user = new User ({
        name : name,
        email : email,
        password: password,
        avatar: fileUrl,
    });

    try{
        const savedUser = await user.save();
        console.log(savedUser);
        res.status(201).json({ message: "User created Succ" , user : savedUser})
    } catch(error){
        return next(new ErrorHandler("Error creating User" , 500))
    }
})

module.exports = router;