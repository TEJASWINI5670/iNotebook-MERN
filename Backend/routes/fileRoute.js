const multer = require("multer");
const express=require("express");
const upload = require("../middleware/uploadFilesusingMulter");
const fileModel = require("../models/fileModel");
const router=express().router



// router.post("/file-upload",upload.single("my-files"),async(req,res)=>{
//     try {


//         return res.status(200).json({message:"File inserted successfully",status:true})
        
//     } catch (error) {
//         console.log(error);
        
//         return res.status(500).json({
//         message: error.message,
//         success: false
//     });
//     }
// })

//----------------------------------------------------------------------------------------------------------------------------------
router.post("/file-upload",upload.array("my-files"),async(req,res)=>{
    try {


        return res.status(200).json({message:"File inserted successfully",status:true})
        
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
        message: error.message,
        success: false
    });
    }
})
module.exports=router


//Test 
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
// </head>
// <body>
// <form action="http://localhost:8500/api/upload/file-upload" method="post">
//     <input type="file" name="my-files" id="my-files">
//     <button type="submit">Upload</button>
// </form>

//     <script src="script.js"></script>
// </body>
// </html>


//can search by
//http://localhost:8500/assets/data/uploads/image1.jpg --> in the browser

