import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import { response } from "express";
import fs from "fs";


cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type: "auto"
        })

    //file has succesfuly uploaded..
    console.log("successfuly file has uploaded",response.url);
    return response;
    
    } catch (error) {
        fs.unlinkSync(localFilePath)  // remove the localy saved temporary file as upload operation got failed .
        return null;
    }
} 


export {uploadOnCloudinary}