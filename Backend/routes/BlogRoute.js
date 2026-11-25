//Request 25

const { body } = require("express-validator");
// const BlogModel = require("../models/blogModel");
const express=require("express");
const create_new_blog = require("../controller/blogController");
const router=express().router




router.post("/create-new-blog",[
    body("title").isString().withMessage("Invalid string").isLength({min:10,max:150}),
    body("author").isString().withMessage("Invalid Author").isLength({min:2,max:26}),
    body("content").isArray().withMessage("Invalid Content")
],create_new_blog)

module.exports=router