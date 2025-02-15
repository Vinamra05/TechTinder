import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://vinamrasharma0523:e5kfrwBw1khsq04a@cluster0.1uoi0.mongodb.net/"); 
}
