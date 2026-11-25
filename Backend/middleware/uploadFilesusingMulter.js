const path=require("path")

const multer = require("multer");
const uploadPath=path.join(process.cwd(),"statics","uploads")
console.log(uploadPath);  //output:  C:\Users\LALITH KUMAR C\OneDrive\Desktop\Teju(java)\AI powered full stack development (MERN stack)\iNotebook\statics\uploads
const {v4}=require("uuid")//helps to generate universal id




//diskstorage--> helps where data must be saved ;under which folder
//copy paste
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    console.log(file.originalname);
    console.log(path.extname(file.originalname));
    console.log(file);
    
    
    const uniqueSuffix = Date.now()+"-"+v4()
    cb(null, file.fieldname + '-' + uniqueSuffix+path.extname(file.originalname)) //path.extname()--> helps to get exact extension while downloads 
  }
})

const upload = multer({ storage: storage })

//___________________________________________________________________________________________________________________________________________

console.log(process.cwd());//gives current folder location 

//output:  C:\Users\LALITH KUMAR C\OneDrive\Desktop\Teju(java)\AI powered full stack development (MERN stack)\iNotebook

//___________________________________________________________________________________________________________________________________________


//uuid -->helps to generate universal id
console.log(v4());//output : 8bfb0c46-ff77-425a-b8b3-1b5525ce9e27  --> 36 character
console.log(Date.now()+"-"+v4());//out of 10 --> 1 random can be repeated in uuid so we must use Date.now() to overcome it



module.exports=upload