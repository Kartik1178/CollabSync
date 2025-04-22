import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads/resumes');

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created upload directory:', uploadDir);
} else {
  console.log('ℹ️ Upload directory exists:', uploadDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

const router = express.Router();

router.post('/register/initial', async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    if (!name || !email || !password || !age) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // 👈 for local dev only
        sameSite: 'lax', // or 'none' for cross-origin
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        step: 1
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.put('/register/resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file required' });
    }

    const relativeResumePath = `/uploads/resumes/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resume: relativeResumePath },
      { new: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        resume: relativeResumePath,
        step: 2
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// Step 3: Technologies (Protected)
router.put('/register/technologies', auth, async (req, res) => {
  try {
    const { technologies } = req.body;
    if (!technologies?.length) {
      return res.status(400).json({ success: false, message: 'Select at least one technology' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { technologies },
      { new: true }
    ).populate('technologies', 'name category');

    res.json({
      success: true,
      user: {
        id: user._id,
        technologies: user.technologies,
        step: 3
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// GET user profile/details (Protected)
router.get('/me', auth, async (req, res) => {
  try {
    // Fetch user details excluding password and including resume path
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        resume: user.resume,  
        technologies: user.technologies,  
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.put("/update-profile", auth, async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      bio: req.body.bio,
      role: req.body.role,
      email: req.body.email,
      age: req.body.age,
      resume: req.body.resume,
      image: req.body.image,
      technologies: req.body.technologies,
      projects: req.body.projects,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});




export default router;
