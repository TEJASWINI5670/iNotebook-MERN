const { validationResult} = require("express-validator");
const BlogModel = require("../models/blogModel");

const create_new_blog=async(req,res)=>{
    try {
        const errors=validationResult(req)  //The line const errors = validationResult(req) is used in Node.js applications with the express-validator library to extract validation errors from an incoming HTTP request.
                if(errors.array().length>0){
                    return res.status(400).json({errors,message:"Validation Error",status:false}) 
                }
        
        const newContent=new BlogModel({
            title:req.body.title,
            author:req.body.author,
            content:req.body.content
        })

        await newContent.save()

        return res.status(200).json({message:"Blog inserted",status:true})

    } catch (error) {
        return res.status(500).json({message:"Internal server Error",success:false})
    }
}

module.exports=create_new_blog