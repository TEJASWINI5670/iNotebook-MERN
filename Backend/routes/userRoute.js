const express=require("express")
const {body}=require("express-validator")
const router=express().router
const {create_new_user,login_user,sendOTPEmail} = require("../controller/userController");


router.post("/create-new-user",[ 
    body("otp").isString().withMessage("Invalid OTP").isLength({min:6,max:6}).withMessage("Please enter 6 digit otp only"),
    body("name").isString().withMessage("Invalid name").isLength({min:2,max:30}).withMessage("Name must be with 2 to 26 character"),
    body("email").isEmail().withMessage("Invalid email"),
    body("mobile_no").isMobilePhone("en-IN").withMessage("Only Indian numbers are allowed"),
    body("password").isString().withMessage("Invalid password").isLength({min:8,max:26}).withMessage("Invalid password"),
    body("confirm_password").isString().withMessage("Invalid confirm password").isLength({min:8,max:26}).withMessage("Invalid confirm password")],create_new_user)


router.post("/login_user",[
       body("email").isEmail().withMessage("Invalid email"),
       body("password").isString().withMessage("Invalid password").isLength({min:8,max:26}).withMessage("Invalid password")

],login_user)

//sendotp
router.post("/sendOTP",[
    body("email").isEmail().withMessage("Invalid email")

],sendOTPEmail)

//export router

module.exports=router