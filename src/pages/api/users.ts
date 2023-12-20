import connectDB from '../../utils/connectDB';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const handler = async (req: any, res: any) => {
  try {
    const db = await connectDB();
    console.log('Using existing MongoDB connection');

    // Destructuring the request body
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ success: false, msg: 'User already exists!' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);  // Generate salt
    const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password

    // Create a new user with hashed password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log('User registered successfully.');

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET!,  // Make sure to set this in your environment variables
      { expiresIn: '5d' }       // Token expires in 1 hour
    );

    // Respond with success message and token
    return res.status(201).json({ success: true, msg: 'Signup successful!', token });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};
export default handler;