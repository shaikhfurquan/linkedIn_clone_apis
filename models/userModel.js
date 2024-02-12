import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "user name is required"]
    },
    lastName: {
        type: String,
        required: [true, "user name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    userType: {
        type: String,
        required: [true, "user type is required"],
        emun: ['client', 'admin', 'super admin'],
        default: 'client',
    },
    answer : {
        type : String,
        required : true ,
    }
} , {timestamps : true})


const UserModel = mongoose.model('User', userSchema)


export default UserModel