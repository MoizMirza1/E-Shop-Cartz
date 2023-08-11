const express = require("express");
const ErrorHandler = require("./Middleware/error");
const app = express()
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
const cors = require("cors")






app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use("/" , express.static("uploads"))
app.use(bodyParser.urlencoded({extended:true}))




// config 

if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({
        path: "backend/config/.env"
    })
}

//imports routes

const user = require('./controller/user')

app.use("/api/v2" , user)
// its for error handling

app.use(ErrorHandler)
module.exports = app;