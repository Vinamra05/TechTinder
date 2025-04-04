import express from "express";
import { validateSignUpData } from "../utils/validation.js";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";

export const authRouter = express.Router();


authRouter.post("/signup", async (req, res) => {
    // console.log(req.body);
    try {
      validateSignUpData(req);
      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new userModel({
        ...req.body,
        password: hashedPassword,
      });
      await user.save({ validateBeforeSave: false });
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
      res.status(400).send("Error in Saving Data: " + err.message);
    }
  });
  

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await userModel.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token  = await user.getJWT();
      // console.log(token);

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error in Login: " + err.message);
  }
});


authRouter.post("/logout", async (req, res) => {
  res.cookie("token",null,{
    expires: new Date(Date.now())
  });  
  res.send("Logged Out Successfully");
}); 