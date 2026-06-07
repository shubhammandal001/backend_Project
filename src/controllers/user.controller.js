import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {User} from "../models/user.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req , res) => {
      
    // get user details from frontend 
    // validation - not empty
    //check if user already exists : username, email
    //check for image and avtar 
    //upload them on cloudinary, avatar 
    // creat user object - creat entry in db
    // remove password and refresh token field from response 
    // check for user creation
    //return response
    
    const {fullname, email, username, password} = req.body
    //console.log("email: ",email );

    if (
        [fullname,email,username,password].some((field)=>field?.trim() === "")
    ) {
        throw new apiError(400,"All files are required")
    }

    //.......
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
    if (existedUser) {
        throw new apiError(409,"User with email or username already exists")
    }

    //....
    const avatarLocalpath = req.files?.avatar[0]?.path;
    //const coverImageLocalpath = req.files?.coverImage[0]?.path;

    let coverImageLocalpath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalpath = req.files.coverImage[0].path
    }

    if (!avatarLocalpath) {
        throw new apiError(400,"Avatar file is required ")
    }

    //....
    const avatar = await uploadOnCloudinary(avatarLocalpath)
    const coverImage = await uploadOnCloudinary(coverImageLocalpath)

    if (!avatar) {
        throw new apiError(400,"AAvatar file is required")
    }

    //.....
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

        const createdUser = await User.findById(user._id).select(
        "-password  -refreshToken"
    )

    if (!createdUser) {
        throw new apiError(500,"something went wrong while regestring the user")
    }

    //...
    return res.status(201).json(
        new apiResponse(200,createdUser,"user registered successfully")
    )
})



export {registerUser};