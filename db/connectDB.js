import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL + process.env.DB_NAME)
        console.log(`connected to db successfully ==> ${process.env.MONGO_URL + process.env.DB_NAME} `);
    } catch (error) {
        console.log('Error connecting to DB ==> ' , error.message);
    }  
}

export default connectDB