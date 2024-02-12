import express from 'express';
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js';
import userRouter from './routes/userRoute.js';

import cookieParser from "cookie-parser";


const app = express()
dotenv.config()

//express middlewares
app.use(cookieParser())
app.use(express.json())


//routes
app.use('/api/user' , userRouter)


//connection of mongodb
connectDB()


app.listen(process.env.PORT , ()=>{
    console.log(`App listening on ${process.env.PORT}`);
})