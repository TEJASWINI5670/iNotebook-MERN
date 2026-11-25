const { default: mongoose } = require("mongoose");

const file_schema=new mongoose.Schema({
    file_url:{
        type:String,
        required:true
    }

},{timestamps:true})

const fileModel=new mongoose.model("inb_file_details",file_schema)

module.exports=fileModel