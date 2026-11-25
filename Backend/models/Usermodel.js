const { default: mongoose } = require("mongoose");

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile_no:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
    // login_history:{
    //     type:[Array]
    // }
},{timestamps:true})


const UserModel=new mongoose.model("iNb_user_details",UserSchema)
module.exports=UserModel