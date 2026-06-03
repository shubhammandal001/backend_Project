import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)  //originalname add krana axxi baat nahi hai dhyan rkhna filal use kar le rhe hai.
  }
})

export const upload = multer({
     storage,
})