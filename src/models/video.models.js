import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema(
    {
        videoFile:{
            type: String, // cloudnary url
            required: true,
        },
         thumbnail:{
            type: String, // cloudnary url
            required: true,
        },
         tittle:{
            type: String, 
            required: true,
        },
        description:{
            type: String,
            required: true,
        },
         duration:{
            type: Number,
            required: true,
        },
         views:{
            type: Number,
            default: 0
        },
        ispublished:{
            type:Boolean,
            default:true
        },
         owner:{
            type: Schema.Types.ObjectId
            ref:"User",
            required: true,
        }
    },{timestamps:true})

export const Video = mongoose.model("Video",videoSchema)