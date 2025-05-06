import express from 'express';
import { userAuth } from '../middlewares/auth.js';
import ChatModel from '../models/chat.js';

const chatRouter = express.Router();


chatRouter.get('/chat/:targetUserId', userAuth ,async (req, res) => {
    const {  targetUserId } = req.params;
    const userId = req.user._id;
    try {
        let chat = await ChatModel.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate({
            path: "messages.sender",
            select: "firstName lastName photoUrl", 
        });
        if(!chat){
            chat =  new ChatModel({
                participants: [userId, targetUserId],
                messages: [], 
            });
            await chat.save();
        }
        res.status(200).json({ chat });
    } catch (error) {
        console.log("Error in finding chat", error);
    }
});

export default chatRouter;