
const {validationResult}=require("express-validator")
const UserModel = require("../models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendOTP = require("../services/generateOTOforLogin");
const OTPModel = require("../models/OTPModels");



const create_new_user=async(req,res)=>{
        try {
            console.log("Body:", req.body);
            const errors=validationResult(req)
            if(errors.array().length>0){
                return res.status(400).json({errors,message:"Validation Error",status:false})
            }
            
             const exist_otp=await OTPModel.find({email:req.body.email}).sort({_id:-1}).limit(1) ;
             //sort(-1)--> helps to get the new entries and arrange in descending order and {limit :1 } --> gives only one record or data
             console.log("This is what am expecting: ",exist_otp);
             
             if(exist_otp.length===0){
                return res.status(400).json({errors,message:"Invalid credentials",status:false})
             }
             //compare
             if(exist_otp[0].otp_code!==req.body.otp){
                return res.status(400).json({errors,message:"Invalid credentials",status:false})
             }
             console.log(exist_otp);
             //----------------------------------------------------------------
             //15mins 
             let entryData=new Date(exist_otp[0].createdAt)
             console.log(entryData);//gets the exist_otp's createdAt
             

             //The getTime() method converts the date into a timestamp and convert to number of milliseconds
             //15 * 60 * 1000--> convert the 15 minute to millisecondand add it to entryData
             entryData=entryData.getTime() +15 * 60 * 1000;//add 15mins to the OTP time in milliseconds
            console.log(entryData);

             let currentTime=new Date().getTime()//convert to milliseconds
             
             
             if(currentTime>entryData){
                return res.status(400).json({errors,message:"OTP expired",status:false})
             }


             
             
            //check if email exist
            const exist_email=await UserModel.findOne({email:req.body.email})
            if(exist_email){
                return res.status(400).json({message:"Email already exist",success:false})
            }

            //check if mobile_no  exist
             const exist_mobileNo=await UserModel.findOne({mobile_no:req.body.mobile_no})
            if(exist_mobileNo){
                return res.status(400).json({message:"This mobile number already exist",success:false})
            }


            //check password and confirm password matches 
            if(req.body.password!==req.body.confirm_password){
                return res.status(400).json({message:"Password doesn't match",success:false})
            }

            //if password matches then it should encrpyt the data 
            const saltRounds = 10;

            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(req.body.password, salt);

            //store data 
            const newEntry=new UserModel({
                name:req.body.name,
                email:req.body.email,
                mobile_no:req.body.mobile_no,
                password:hash
            })

            await newEntry.save()

            return res.status(200).json({message:"Account created successfully",success:true})

        } catch (error) {
    console.error(error);

    return res.status(500).json({
        message: error.message,
        success: false
    });
}
}

const login_user=async(req,res)=>{
    try {
          const errors=validationResult(req)  //The line const errors = validationResult(req) is used in Node.js applications with the express-validator library to extract validation errors from an incoming HTTP request.
            if(errors.array().length>0){
                return res.status(400).json({errors,message:"Validation Error",status:false})
            }

           

            const exist_email=await UserModel.findOne({email:req.body.email})
             if(!exist_email){
                return res.status(400).json({message:"Email not found",success:false})
            }

            // Load hash from your password DB.//cp
            const flag=bcrypt.compareSync(req.body.password, exist_email.password); // true
            if(!flag){
                return res.status(400).json({message:"Password doesnot match",success:false})
            }
        const token = jwt.sign({ _id: exist_email._id,email:exist_email.email,mobile_no:exist_email.mobile_no }, process.env.SECRET_KEY);
        return res.status(200).json({message:"Login Successfully",token:token,success:true})
        
    } catch (error) {
        return res.status(500).json({message:"Internal server Error",success:false})
    }
}

//----------------------
//send otp function
const sendOTPEmail=async(req,res)=>{
  try {
      const errors=validationResult(req)  //The line const errors = validationResult(req) is used in Node.js applications with the express-validator library to extract validation errors from an incoming HTTP request.
            if(errors.array().length>0){
                return res.status(400).json({errors,message:"Validation Error",status:false})
            }

             // Do not report success until the email has been delivered and the OTP
             // has been saved.  Otherwise the client moves to the OTP step even
             // when sending the email failed.
             await sendOTP(req.body.email)
             return res.status(200).json({message:"OTP is sent successfully",success:true})

             
    
  } catch (error) {
      console.error("Unable to send OTP:", error);
      return res.status(500).json({message:"Unable to send OTP. Please try again.",success:false})
  }
}

module.exports={create_new_user,login_user,sendOTPEmail}
