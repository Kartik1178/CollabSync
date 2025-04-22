import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');;

    if (!token) {
      return res.status(403).json({
        success: false,
        message: 'Authorization denied. Please login first'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

   
    req.user = user;
    next();
    
  } catch (err) {
    console.error('Authentication error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export default auth;
