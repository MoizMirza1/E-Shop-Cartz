const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const catchAsyncError = require("../middleware/catchAsyncError")
const sendToken = require("../utils/jwtToken");
const isAuthenticated = require("../middleware/auth");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    console.log("Request received to create a user");

    const { name, email, password } = req.body;
    console.log("Received user data:", name, email);

    const userEmail = await User.findOne({ email });

    if (userEmail) {
      console.log("User already exists:", userEmail);

      const filename = req.file.filename;
      const filepath = `uploads/${filename}`;
      fs.unlink(filepath, (error) => {
        if (error) {
          console.log("Error deleting file:", error);
          res.status(500).json({ message: "Error deleting file" });
        }
      });
      return next(new ErrorHandler("User already exists", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    console.log("File URL:", fileUrl);

    const user = new User({
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    });
    const activationToken = user.createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;
    console.log("Activation URL:", activationUrl);

    await sendMail({
      email: user.email,
      subject: "E-Cartz Account Activation",
      message: `Hello ${user.name}, Please click on the link to activate your account: \n\n ${activationUrl}`,
    });
    console.log("Activation email sent successfully");

    res.status(201).json({
      success: true,
      message: `Please check your email: ${user.email} to activate your account`,
    });
  } catch (error) {
    console.log("Error:", error);
    return next(new ErrorHandler("Error creating User", 500));
  }
});

// create Activation Token

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: "5m" });
};

// Activate Email Account

router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid Token", 400));
      }

      const { name, email, password, avatar } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }

      user = await User.create({
        name,
        email,
        password,
        avatar,
      });

      sendToken(user, 201, res);
    } catch (error) {
      console.log("Error:", error);
      return next(
        new ErrorHandler(Error.message, "Error activating account", 500)
      );
    }
  })
);

// Login User

router.post(
  "/login",
  catchAsyncError(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User already Exist", 404));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
      }

      sendToken(user, 201, res);
    } catch (error) {
      console.log("Error:", error);
      return next(
        new ErrorHandler(error.message, "Error logging in user", 500)
      );
    }
  })
);



// router.get(
//   "/getuser",
//   isAuthenticated,
//   catchAsyncError(async (req, res, next) => {
//     try {
//       const user = await User.findById(req.user.id);

//       if (!user) {
//         return next(new ErrorHandler("User doesn't exists", 400));
//       }

//       res.status(200).json({
//         success: true,
//         user,
//       });
//     } catch (error) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   })
// );

module.exports = router;
