import UserModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';



export const userRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, password , answer} = req.body;

        // Check if the user is already registered
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already registered.",
            });
        }

        if (!firstName || !lastName || !email || !password || !answer) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });

        }

        // If the user is not found, register the user with a hashed password
        const hashPassword = await bcrypt.hash(password, 10);
        user = await UserModel.create({
            firstName,
            lastName,
            email,
            answer,
            password: hashPassword,
        });

        // Generate JWT token and set it in a cookie
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        res.status(201).cookie("token", token, {
            httpOnly: true,
            maxAge: 10 * 60 * 1000,
        }).json({
            success: true,
            message: `${user.firstName} registered successfully.`,
            user: user,
            token: token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while registering user.",
            error: error.message,
        });
    }
}


export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user is already registered
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found, Register the user first...",
            });
        }

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });

        }

        //if user found then we will verify that password
        const isMatch = await bcrypt.compare(password, user.password)
        //if password is not match then
        if (!isMatch) return res.status(404).json({
            success: false,
            message: "Invalid Credentials..."
        })

        // Generate JWT token and set it in a cookie
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        res.status(201).cookie("token", token, {
            httpOnly: true,
            maxAge: 10 * 60 * 1000,
        }).json({
            success: true,
            message: `${user.firstName} login successfully.`,
            user: user,
            token: token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while login user.",
            error: error.message,
        });
    }
}


export const userLogout = (req, res) => {
    try {
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now())
        }).json({
            success: true,
            message: "User logged-Out successfully..."
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: "Error while logged-Out user",
            error: error.message
        })
    }
}


export const getMyProfile = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: "Error while logged-Out user",
            error: error.message
        })
    }
}


export const getUserById = async (req, res) => {
    try {
        const id = req.params.id
        const user = await UserModel.findById(id)
        if (!user) return res.status(404).json({
            success: false,
            message: "Invalid ID"
        })

        console.log(user);
        res.status(200).json({
            success: false,
            user: user
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: "Error while showing user by id",
            error: error.message
        })
    }
}


export const userDelete = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id);
        const user = await UserModel.findByIdAndDelete(id)
        console.log(user);
        if (!user) return res.status(404).json({
            success: false,
            message: "Invalid ID"
        })

        console.log(user);
        res.status(200).json({
            success: true,
            message : "user deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: "Error while deleting user",
            error: error.message
        })
    }
}


export const userUpdate = async(req, res) => {
    try {
        const id = req.params.id
        const user = await UserModel.findByIdAndUpdate(id, req.body , {new :true})

        if (!user) return res.status(404).json({
            success: false,
            message: "Invalid ID"
        })

        res.status(200).json({
            success: true,
            message : "user Updated successfully",
            user : user
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: "Error while updating user",
            error: error.message
        })
    }
}



export const resetPassword = async (req, res) => {
    try {
        // finding user on the basis of email
        const { email, newPassword, answer } = req.body
        if (!email || !newPassword || !answer) {
            return res.status(500).json({
                succcess: false,
                message: "Please provide all fields"
            })
        }

        const user = await UserModel.findOne({ email, answer })
        if (!user) {
            return res.status(500).json({
                succcess: false,
                message: "User not found, Invalid answer"
            })
        }

        //hashing the newPassword
        const hashPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashPassword
        await user.save()

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
    } catch (error) {
        res.status(500).json({
            succcess: false,
            message: "Error while reset user password",
            error: error.message
        })
    }
}


export const updatePassword = async (req, res) => {
    try {
        //finding user on the basis of id
        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this id"
            })
        }

        //getting the data from the req.body
        const { oldPassword, newPassword } = req.body
        if (!oldPassword || !newPassword) {
            return res.status(404).json({
                success: false,
                message: "Please provide OldPassword and NewPassword"
            })
        }

        //compare the oldPassword and userPassword
        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            return res.status(500).json({
                success: false,
                message: "Invalid old password"
            })
        }

        //hashing the password
        const hashPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashPassword
        await user.save()

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    } catch (error) {
        res.status(500).json({
            succcess: false,
            message: "Error while updating user password",
            error: error.message
        })
    }
}