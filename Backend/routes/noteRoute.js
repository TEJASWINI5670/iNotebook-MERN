

const express=require("express")
const verifyToken = require("../middleware/verifyToken")
const router=express().router
const {body}=require("express-validator")
const { create_new_note, fetch_User_data, update_specific_note, delete_specific_note } = require("../controller/noteController");

router.post("/create-new-note",verifyToken,[
    body("title").isString().withMessage("Invalid Title").notEmpty().withMessage("shouldn't be empty").isLength({min:10,max:150}).withMessage("Title must be greater than 10 character and lesser than 150 characters"),
      body("description").isString().withMessage("Invalid description").notEmpty().withMessage("shouldn't be empty").isLength({min:10}).withMessage("Description must be greater than 10 character ")

],create_new_note)

//fetch the data
router.get("/fetch-user-notes",verifyToken,fetch_User_data)


//update note
router.put("/update-my-specific-note",verifyToken,[
    body("_id").isMongoId().withMessage("Invalid object id"),
    body("title").isString().withMessage("Invalid Title").notEmpty().withMessage("shouldn't be empty").isLength({min:10,max:150}).withMessage("Title must be greater than 10 character and lesser than 150 characters"),
    body("description").isString().withMessage("Invalid description").notEmpty().withMessage("shouldn't be empty").isLength({min:10}).withMessage("Description must be greater than 10 character ")
],update_specific_note)



//delete the note 
router.delete("/delete-specific-note",verifyToken,[
    body("_id").isMongoId().withMessage("Invalid object id")
],delete_specific_note)

//api integrate
module.exports=router



//Flow chart

//JWT Token
//    ↓
// verifyToken
//    ↓
// req.token = User ID
//    ↓
// Find User
//    ↓
// Find Note using:
// _id = Note ID
// user_id = req.token
//    ↓
// Update title & description
//    ↓
// Save