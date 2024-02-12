
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()


const generateCookie = (user, res, statusCode = 200, message) => {

    //token
    // const token = jwt.sign({user}, '!@#$%^&*()')
    const token = jwt.sign({ _id: user._id }, SEC_KEY)
    console.log(token);

    res.status(201).cookie("token", token, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
    }).json({
        success: true,
        message
    })
}


export default generateCookie