import mongoose, { Document, Model, Schema } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema: Schema<UserDocument> = new mongoose.Schema({
  name:{
    type:String,
    required: true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
  },
  password:{
    type:String,
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now,
  },
});

const User: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

export default User;