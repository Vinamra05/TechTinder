import express from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import userModel from "../models/user.js";
export const requestRouter = express.Router();
import sendEmail from "../utils/sendEmail.js";

requestRouter.post(
  "/request/send/:status/:touserid",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.touserid;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid Status Type: " + status,
        });
      }
      const toUser = await userModel.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: "User Not Found!",
        });
      }
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        throw new Error("Connection Request Already Sent");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      if (status === "interested") {
        const subject =
          "👀 Someone’s interested in connecting with you on TechTinder!";
        const body = `
  <p style="font-size: 16px; line-height: 1.6; margin: 0;">
    <strong>${req.user.firstName}</strong> has sent you a connection request on <strong>TechTinder</strong> and marked you as <strong>Interested</strong>!
  </p>
  <p style="font-size: 16px; line-height: 1.6; margin-top: 12px;">
    Head over to your account to view the request and respond.
  </p>
  <p style="font-size: 14px; margin-top: 24px;">
    👉 <a href="https://techtinder.live" style="color: #8b5cf6; text-decoration: none; font-weight: bold;">View Request Now</a>
  </p>
`;
        const emailRes = await sendEmail.run(subject, body);
        // console.log("Email Response: ", emailRes);
      }

      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
    // res.send(user.firstName + "sent the connect request");
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid Status Type: " + status,
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection Request Not Found",
        });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: loggedInUser.firstName + " has " + status,
        data,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);
