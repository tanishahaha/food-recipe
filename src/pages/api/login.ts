import connectDB from '../../utils/connectDB';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const loginHandler =async (req:any,res:any) => {
  try{
    const db=await connectDB();
    console.log("using existing mongoDB connection for login");
    
    const {email,password}=req.body;

    const user=await User.findOne({email});

    if(!user){
      return res.status(400).json({success:false,msg:'user does not exists'});
    }

    const isMatch=await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400).json({success:false,msg:'invalid credentials'})
    }

    const token =jwt.sign(
      {userId:user._id},
      process.env.JWT_SECRET!,{expiresIn:'5d'});

      return res.status(200).json({success:true,msg:'Login successfull',token});
  }catch(error){
    console.log("mongo connection failed",error);
    return res.status(500).json({success:false,msg:"server error"})
  }
  
}

export default loginHandler;
