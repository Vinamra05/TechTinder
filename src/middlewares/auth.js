import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
import dotenv from 'dotenv';
dotenv.config();

export const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login First!");
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;
    const user = await userModel.findById(_id);
    if (!user) {
      throw new Error("User Does not Exist");
    } else {
        req.user = user;
      next();
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};
