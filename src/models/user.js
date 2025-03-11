import validator from "validator";
import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      match: [/^[a-zA-Z]+$/, "Invalid First Name"],
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      match: [/^[a-zA-Z]+$/, "Invalid Last Name "],
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid Email Format",
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Min 8 chars, at least 1 lowercase, 1 uppercase, 1 number, 1 special (!@#$%^&*).",
            "No spaces allowed." + value
          );
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 90,
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Gender Data is not valid");
        }
      },
    },

    photoUrl: {
      type: String,
      default:
        "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL" + value);
        }
      },
    },
    about: {
      type: String,
      default:
        "Versatile Tech Enthusiast with Expertise in Software Development and Problem-Solving",
      maxLength: 300,
    },
    skills: {
      type: [String],
      minLength: 1,
      maxLength:25,
      validate: {
        validator: function (skillsArray) {
          return skillsArray.length >= 1 && skillsArray.length <= 50;
        },
        message: "Oops! You can only add only  upto 50 skills.",
      }
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.getJWT = async function () {
  const user = this;
   // yaha pe arrow function nh bna skte KYUKI THIS USE KRNA HAI  VO Usme nh hoga or yaha this isliye use kiya hi kyuki ye schema ka instance hai to har instance ko refer krne ke liye use kiya hai
  const token = await jwt.sign({ _id: user._id }, "Techtinder@123", {
    expiresIn: "1d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid =  await bcrypt.compare(passwordInputByUser, user.password);
  return isPasswordValid;
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
