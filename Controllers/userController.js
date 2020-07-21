const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync")

exports.getSelf=catchAsync(
    async (req,res,next)=>{
        const {userId}=req;
        // at that point it is confirmed user does exist
        // const userId = "5f169583f0812d103d8c5e08";
      
        const user = await User.findById(userId);
     
        if(user){
            const {fullName,email}=user;
            res.json({
                data:{
                    fullName,
                    email
                }
            })
        }
        else
            res.status(400).json({
                status:"failed",
                message:"user not found"
            })
            
    }
);