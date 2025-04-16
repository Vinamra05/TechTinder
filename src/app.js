import express from "express";
import { connectDB } from "./config/database.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import {authRouter} from "./routes/auth.js";
import {requestRouter} from "./routes/request.js";
import {profileRouter} from "./routes/profile.js"; 
import {userRouter} from "./routes/user.js";
import dotenv from 'dotenv';
import "./utils/cronjob.js";
dotenv.config();


const app = express();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}));
app.use(express.json());  

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", requestRouter); 
app.use("/", profileRouter); 
app.use("/",userRouter);

 

connectDB();


app.listen(process.env.PORT, () => {
  console.log("server listening on Port:", process.env.PORT);
});
