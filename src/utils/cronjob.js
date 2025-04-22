import cron from "node-cron";
import { endOfDay, startOfDay, subDays } from "date-fns";
import ConnectionRequestModel from "../models/connectionRequest.js";
import sendEmail from "./sendEmail.js";
cron.schedule("0 11 * * *", async () => {
  // console.log('running a task every minute');

  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      }, // 24 hours old
    }).populate("fromUserId toUserId");

    const listofEmails = [
      ...new Set(pendingRequests.map((request) => request.toUserId.emailId)),
    ];
    console.log("listofEmails",listofEmails);
    for (const email of listofEmails) {
      const userRequests = pendingRequests.filter(
        (req) => req.toUserId.emailId === email
      );
      const userName = userRequests[0]?.toUserId?.firstName || "there";

      //console.log("userName", userName);
      // console.log(email);
      try {
        const res = await sendEmail.run(
          " 🔔Reminder: You Have Pending Connection Requests On TechTinder!",

          `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
                      <h2 style="color: #7c3aed; text-align: center;">🔔 TechTinder Connection Reminder</h2>
                      <p style="font-size: 16px; color: #333;"><strong>Hey! ${userName}👋</strong></p>
                      <p style="font-size: 16px; color: #333;">You have <strong>pending friend connection requests</strong> waiting for your response.</p>
                      <p style="font-size: 16px; color: #333;">We recommend logging in to <a href="https://techtinder.live" style="color: #7c3aed; text-decoration: none; font-weight: 500;">TechTinder</a> to view and respond to them.</p>
                      <div style="text-align: center; margin: 20px 0;">
                        <a href="https://techtinder.live" style="display: inline-block; background-color: #7c3aed; color: #fff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">View My Requests</a>
                      </div>
                      <p style="font-size: 14px; color: #666;">If you've already responded, you can ignore this email.</p>
                      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
                      <p style="font-size: 12px; color: #999; text-align: center;">Sent with ❤️ by TechTinder • <a href="https://techtinder.live" style="color: #999;">techtinder.live</a></p>
                    </div>
                    `,
          email
        );
        // console.log("reminder Email sent successfully",res);
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }
  } catch (error) {
    console.error("Error executing cron job:", error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});
