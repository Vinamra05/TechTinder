import express from "express";
import { connectDB } from "./config/database.js";
import userModel from "./models/user.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signup", async (req, res) => {
  // console.log(req.body);
  // const { firstName, lastName, emailId, password,age,gender} = req.body;
  const user = new userModel(req.body);

  try {
    await user
      .save()
      .then((data) => {
        res.send("Data jaa chuka hai" + data);
      })
      .catch((err) => {
        res.send(err.message);
      });
  } catch (err) {
    res.status(500).send("Error in saving data" + err.message);
  }
});

app.get("/users", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await userModel.find({ emailId: userEmail });
    // console.log(users);
    if (users.length == 0) {
      res.send("No user found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("Error in fetching data" + err);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await userModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Error in fetching data" + err);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await userModel.findByIdAndDelete(userId);
    if (user.deletedCount == 0) {
      res.send("No user found");
    } else {
      res.send("User deleted successfully");
    }
  } catch (err) {
    res.status(500).send("Error in deleting data" + err);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const updateData = req.body;

  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "userId", 
      "photoUrl",
      "password",
      "about",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(updateData).every((update) => {
      return ALLOWED_UPDATES.includes(update);
    });
    if (!isUpdateAllowed) {
     throw new Error("Update not allowed");
    }

    if(updateData?.skills.length>25){
      throw new Error("Skills length should be less than 25");
    }

    const user = await userModel.findByIdAndUpdate(
      { _id: userId },
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
    if (!user) {
      res.send("No user found");
    } else {
      res.send("User updated successfully");
    }
  } catch (err) {
    // console.error(err);
    res.status(400).send("Error in updating data" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection failed");
  });

app.listen(3000, () => {
  console.log("server listening on Port:3000");
});
