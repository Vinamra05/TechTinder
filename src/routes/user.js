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

// userRouter.get("/feed", userAuth, async (req, res) => {
//   try {

//     const loggedInUser = req.user;
//     const page = parseInt(req.query.page) || 1;
//     let limit = parseInt(req.query.limit) || 10;
//     limit =  limit > 50 ? 50 :limit;
//     const skip = (page-1)*limit;

//     const connectionRequests = await ConnectionRequestModel.find({
//       $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
//     }).select("fromUserId  toUserId");

//     const hideUsersFromFeed = new Set();
//     connectionRequests.forEach((request) => {
//       hideUsersFromFeed.add(request.toUserId.toString());
//       hideUsersFromFeed.add(request.fromUserId.toString());
//     });
//     const users = await UserModel.find({
//       $and:[
//         {_id: { $nin: Array.from(hideUsersFromFeed) }},
//         { _id: { $ne: loggedInUser._id } },
//       ]
//     }).select(USER_SAFE_DATA).skip(skip).limit(limit);
//     res.json({data:users});
//   } catch (error) {
//     res.status(400).send({
//       message: error.message,
//     });
//   }
// });

userRouter.get("/feed", userAuth, async (req, res) => {
  //modified api by me
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    //added by my own for the filter search for specfic skills user will have similar if apply filter
    const skillFilter = req.query.skills ? req.query.skills.split(",") : [];

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.toUserId.toString());
      hideUsersFromFeed.add(request.fromUserId.toString());
    });

    let filterConditions = [
      { _id: { $nin: Array.from(hideUsersFromFeed) } },
      { _id: { $ne: loggedInUser._id } },
    ];

    if (skillFilter.length > 0) {
      filterConditions.push({
        skills: { $in: skillFilter.map((skill) => new RegExp(skill, "i")) }, // yaha i ka matlb case insensitive searching hogi caps m aye query ya small m it will search by as we have made a new reg exp with the i flag
      });
    }

    const users = await UserModel.find({ $and: filterConditions })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});
