import jwt from "jsonwebtoken";
import userModel from "../models/user.js";
export const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid!!");
    }
    const decoded = await jwt.verify(token, "Techtinder@123");
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
