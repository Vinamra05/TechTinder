import express from "express";
import { validateSignUpData } from "../utils/validation.js";
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";

export const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // console.log(req.body);
  try {
    validateSignUpData(req);
    const { emailId,firstName, password } = req.body;
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

    const subject = `👋 TechTinder Signup Successful — Let’s Get You Connected!"

`;
    const body = `
        <p style="font-size: 16px; line-height: 1.6; margin: 0;">
            Hey <strong>${firstName}</strong>,
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 12px;">
          Welcome to <strong>TechTinder</strong> — where developers meet, connect, and collaborate. 🚀
        </p>
        <p style="font-size: 16px; line-height: 1.6; margin-top: 12px;">
            Your account has been successfully created. Start exploring connections that match your skills and goals.
        </p>
        <p style="font-size: 14px; margin-top: 24px;">
            👉 <a href="https://techtinder.live" style="color: #8b5cf6; text-decoration: none; font-weight: bold;">Launch TechTinder Now</a>
                   </p>
      `;

    const emailRes = await sendEmail.run(subject, body,emailId);

    console.log("Signup Email sent successfully for : "+emailId, emailRes);

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
      const token = await user.getJWT();
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
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged Out Successfully");
});
