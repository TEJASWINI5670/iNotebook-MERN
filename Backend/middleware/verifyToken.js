const jwt = require('jsonwebtoken');

// verify a token symmetric - synchronous
const verifyToken=async(req,res,next)=>{
    try {
        const token=req.headers.token
        console.log(token);
        
        if(!token){
             return res.status(400).json({message:"Invalid authentication",success:false})
        }

        // verify a token symmetric - synchronous
       const decoded = jwt.verify(token, process.env.SECRET_KEY);
       console.log(decoded);
       
       if(!decoded){
         return res.status(400).json({message:"Invalid authentication",success:false})
       }

       req.token=decoded
       next()

    } catch (error) {
        return res.status(500).json({message:"Internal server Error",success:false})
        
    }
}

module.exports=verifyToken