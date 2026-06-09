import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// response(res) ko _ likha h async function m kuki res ka use nahi horha tha .
export const verifyJWT = asyncHandler(async(req,_, next) =>{
    try {
        const token = req.cookies?.accessToken  || req.header("Authorization")?.replace("Bearer ","")
    
        if (!token) {
            throw new apiError(
                401,
                "Unauthorized request!"
            )
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            //discuss about frontend
            throw new apiError(401, "Invalid Access Token!")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new apiError(401,error?.message || "Invalid Access token")
    }
})