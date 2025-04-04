import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { validateEditProfileData} from "../utils/validation.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.js";
export const profileRouter = express.Router();


profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if(!validateEditProfileData(req)){
        throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;

    // loggedInUser.firstName = req.body.firstName;
    Object.keys(req.body).forEach((key) => {  
        loggedInUser[key] = req.body[key];
        });  
    // console.log(loggedInUser);
    await loggedInUser.save({ validateBeforeSave: false });
    res.json({message:` Hey! ${loggedInUser.firstName} ${loggedInUser.lastName} , Your  Profile Updated Successfully.`,data:loggedInUser});

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});


profileRouter.patch('/profile/update-password', userAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Basic input validation
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Old and new passwords are required." });
  }

  try {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, loggedInUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid current password." });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.findByIdAndUpdate(
      loggedInUser._id,
      { password: hashedPassword },
      { new: true, runValidators: false }
    );

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error updating password:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});
