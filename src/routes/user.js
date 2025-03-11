import express from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequestModel from "../models/connectionRequest.js";
import UserModel from "../models/user.js";
export const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl about age gender skills";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({
      message: "Data fetched - User Requests",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error in fetching user requests",
      error: error.message,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    //   console.log(connectionRequests);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    // console.log(data);
    res.json({
      data,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {

    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit =  limit > 50 ? 50 :limit;
    const skip = (page-1)*limit;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.toUserId.toString());
      hideUsersFromFeed.add(request.fromUserId.toString());
    });
    const users = await UserModel.find({
      $and:[
        {_id: { $nin: Array.from(hideUsersFromFeed) }},
        { _id: { $ne: loggedInUser._id } },
      ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);
    res.json({data:users});
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});
 