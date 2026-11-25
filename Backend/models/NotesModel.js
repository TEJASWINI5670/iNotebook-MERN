const { default: mongoose } = require("mongoose");


const NoteSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"iNb_user_details",
        required:true
    },
    title:{
        type:String,
        required:true
    },
     description:{
        type:String,
        required:true
    }
},{timestamps:true})

const NoteModel=new mongoose.model("inb_notes_details",NoteSchema)
module.exports=NoteModel