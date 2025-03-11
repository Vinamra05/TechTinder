import mongoose from "mongoose";
const connectionRequestSchema =  new mongoose.Schema({
    fromUserId : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }, 
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored", "interested","accepted","rejected"],
            message:`{VALUE} is incorrect Status Type`
        }
    }

},{
    timestamps:true,
})  

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function(next){   
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cannot send a connection request to yourself");

    }
    next();
})


const  ConnectionRequestModel =  new mongoose.model("ConnectionRequest",connectionRequestSchema);
export default ConnectionRequestModel;

