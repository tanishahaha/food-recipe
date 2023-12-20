import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import connectDB from '../../utils/connectDB';
// ... (other imports and code)

interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

const handler = async (req: any, res: any) => {
  try {
    const db = await connectDB();

    // Extract the token from the Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, msg: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    return res.status(200).json({ success: true, user });

  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

export default handler;
