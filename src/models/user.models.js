import mongoose,{Schema} from "mongoose";

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
        watchHistory:{
            type: Schema.Types.ObjectId,
            ref:"Video",
        },
        password:{
            type: String,  
            required: [ture,"password is required"]
        },
        refreshToken:{
            type:String
        }
    

},{timestamps:ture })

export const User = mongoose.model("User",userSchema)