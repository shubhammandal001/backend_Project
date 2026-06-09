import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {User} from "../models/user.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return{accessToken,refreshToken}
        
    } catch (error) {
        throw new apiError(500,"something went wrong while genarating access or refreshtoken")
    }
}

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

const loginUser = asyncHandler(async(req, res) =>{
    //req body -> data
    //username or email
    //find the user
    //password check 
    //access and refresh token 
    //send cookie(aise hi response bhejta hai )

    const {username,email,password} =  req.body

    if(!username || !email){
        throw new apiError(400,"username or email is requried")
    }

    const user = await User.findOne({
        $or:[{email}, {username}]
    })

    if(!user){
        throw new apiError(404,"user doesn't exist!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new apiError(401,"wrong password!")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new apiResponse(
            200,
            {
                user:loggedInUser, accessToken, refreshToken
            },
            "User logged In Succesfully!"
        )
    )

} )

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new:true
        }

    )

    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",accessToken,options)
    .clearCookie("refreshToken",refreshToken,options)
    .json(new apiResponse(200,{},"User logged Out Succesfully!"))

})



export {
    registerUser,
    loginUser,
    logoutUser,
};