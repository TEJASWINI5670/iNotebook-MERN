//copy paste the imports from noteRoute

const NoteModel = require("../models/NotesModel")
const UserModel = require("../models/Usermodel")
const {validationResult}=require("express-validator")


const create_new_note=async(req,res)=>{
try {

     const errors=validationResult(req)  //The line const errors = validationResult(req) is used in Node.js applications with the express-validator library to extract validation errors from an incoming HTTP request.
                if(errors.array().length>0){
                    return res.status(400).json({errors,message:"Validation Error",status:false}) 
                }
                const exist_user=await UserModel.findOne({_id:req.token})
                if(!exist_user){
                     return res.status(400).json({message:"Invalid authentication",success:false})
                }
                const newNotes=new NoteModel({
                    user_id:req.token,
                    title:req.body.title,
                    description:req.body.description
                })

                await newNotes.save()
    
                return res.status(200).json({message:"Notes Created",status:true})
} catch (error) {
     return res.status(500).json({message:"Internal server Error",success:false})
}
}

//---------------------------------------------------------------------------------------------------------------------------------------

const fetch_User_data = async (req, res) => {
    try {
        const exist_user = await UserModel.findOne({
            _id: req.token
        });

        if (!exist_user) {
            return res.status(400).json({
                message: "Invalid authentication",
                success: false
            });
        }

        const notes_fetch = await NoteModel
            .find({ user_id: req.token })
            .sort({ _id: -1 });

        return res.status(200).json({
            message: "Notes fetched successfully",
            success: true,
            notes: notes_fetch
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal server Error",
            success: false
        });
    }
};


//-----------------------------------------------------------------------------------------------------------
const update_specific_note =async(req,res)=>{
    try {
         const errors=validationResult(req)  //The line const errors = validationResult(req) is used in Node.js applications with the express-validator library to extract validation errors from an incoming HTTP request.
                if(errors.array().length>0){
                    return res.status(400).json({errors,message:"Validation Error",status:false}) 
                }

                const exist_user=await UserModel.findOne({_id:req.token})
                if(!exist_user){
                     return res.status(400).json({message:"Invalid authentication",success:false})
                }

                const exist_node=await NoteModel.findOne({_id:req.body._id,user_id:req.token._id})
                if(!exist_node){
                    return res.status(400).json({message:"No notes Found",success:false})
                }
                
                exist_node.title=req.body.title
                exist_node.description=req.body.description

                await exist_node.save()

                return res.status(200).json({message:"Notes are updated",success:true})
        
    } catch (error) {
        console.log(error);
        
         return res.status(500).json({message:"Internal server Error",success:false})
    }
}

//--------------------------------------------------------------------------------------------------------

const delete_specific_note=async(req,res)=>{
    try {
        const errors=validationResult(req)  //The line const errors = validationResult(req) is used in Node.js applications with the express-validator library to extract validation errors from an incoming HTTP request.
                if(errors.array().length>0){
                    return res.status(400).json({errors,message:"Validation Error",status:false}) 
                }

                const exist_user=await UserModel.findOne({_id:req.token._id})
                if(!exist_user){
                     return res.status(400).json({message:"Invalid authentication",success:false})
                }

                const exist_node=await NoteModel.findOne({_id:req.body._id,user_id:req.token._id})
                if(!exist_node){
                      return res.status(400).json({message:"No notes Found",success:false})
                }


                await NoteModel.deleteOne({_id:req.body._id})

                return res.status(200).json({message:"Notes successfully deleted"})
        
    } catch (error) {
             return res.status(500).json({message:"Internal server Error",success:false})
    }
}

module.exports={create_new_note,fetch_User_data,update_specific_note,delete_specific_note}