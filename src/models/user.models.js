import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";  // bcyrpt password ko encrypt and decrypt krne k liye use hota h..

const userSchema = new Schema({

        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index:true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname:{
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar:{
            type: String,  // cloudnary url
            required: true
        },
        coverImage:{
            type: String,  // cloudnary url
            required: true
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref:"Video",

            }
        ],
        password:{
            type: String,  
            required: [true,"password is required"]
        },
        refreshToken:{
            type:String
        }
    

},{timestamps:true })

// Hook usekiya h:  save hone just phle password ko encrypt kr rhe h..
userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

// password verify kr rhe h ...
userSchema.methods.isPasswordCorrect = async function (password)
{
 return await bcrypt.compare(password,this.password)   
} 

userSchema.methods.generateAccessToken = function(){
     return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
    
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

// normaly export ho rha h user model ...
export const User = mongoose.model("User",userSchema)