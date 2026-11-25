require('dotenv').config()//1
const dbToconnect=require("./db/db")  //2


const express=require("express")//3
const cors=require("cors")//9
const userRouter=require("./routes/userRoute")//11
const notesRouter=require("./routes/noteRoute")//13
const app=express()//4
const blogRouter=require("./routes/BlogRoute")//15
// const fileUploadRouter=require("./routes/fileRoute")



// 1. Mount the JSON parsing middleware first  //6
app.use(express.json());//7
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://i-notebook-mern-three.vercel.app"
  ]
}));
// app.use('/assets/data', express.static('statics'));  //8---> //add the url in the browser //In Express.js, serving static files like images, CSS, and JavaScript used to require custom routes. With the express.static() function, you can serve static content directly from a folder, making it easier and faster
// //integrate
app.use("/api/user",userRouter)//12 //this should always print after //app.use(express.json());
app.use("/api/notes",notesRouter)//14
// app.use("/api/blog",blogRouter)
// app.use("/api/upload",fileUploadRouter)

const PORT = process.env.PORT || 5000;

dbToconnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Backend started at port number ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
        process.exit(1);
    });
 




