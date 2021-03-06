const express = require('express')
const app = express()
// including .env file
const cors = require('cors')
const passport = require('passport')
const GoogleStrategy = require("passport-google-oauth20").Strategy
const flash = require('connect-flash')
const path = require('path')

const dotenv = require("dotenv")
dotenv.config({path:'./det.env'})
// const passportSetup = require('./passport')

const connectDB = require('./db/connect')

// importing rooutes
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes")
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
require('./controller/passport')

// port
const port = process.env.PORT || 5000

// connect to database

//middleware to handle json data and payloads
app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true,
}))

app.use(express.json())
connectDB()

// middleware to handle cookie
app.use(cookieParser('EXPRESS_SESSION_SECRET'))
// app.use(expressSession({
//     secret:process.env.EXPRESS_SESSION_SECRET,
//     resave:true,
//     saveUninitialized:false,

// }))

// user routes
app.use("/api/v1",userRoutes)

// product routes
app.use("/api/v2",productRoutes)

// middleware routes
app.use(notFound)
app.use(errorHandler)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('frontend/sports/build'))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(
            __dirname,'frontend/sports','build','index.html'
        ))
    })
}

app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`);
})