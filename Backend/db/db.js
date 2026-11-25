const { default: mongoose } = require("mongoose");

const DbToconnect=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Db is connected successfully ");
        
        
    } catch (error) {
    console.log(error);
    throw error;
}
}

module.exports=DbToconnect