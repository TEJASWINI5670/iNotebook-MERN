//nested model

const { default: mongoose } = require("mongoose");


const ContentSchema=new mongoose.Schema({
    headline:{
        type:String,
        required:true
    },
    description:{
          type:String,
        required:true
    }
})


const Blogschema=new mongoose.Schema({
    title:{
         type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    content:[ContentSchema]  //nested model
},{timestamps:true})


const BlogModel=new mongoose.model("inb_blog_details",Blogschema)


module.exports=BlogModel