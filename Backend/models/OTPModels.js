const { default: mongoose } = require("mongoose");

const otpSchema=new mongoose.Schema({
    otp_code:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true

    }
},{timestamps:true})

const OTPModel=mongoose.model("iNb_OTP_details",otpSchema)

module.exports=OTPModel