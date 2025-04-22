
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  bio:String,
  role:{type:String, default:"Junior Developer"},
  email: { type: String, unique: true },
  emailVerified: Date,
  image: String,
  password: String,
  age: Number,
  resume: String,
  technologies: [String],

  projects: [{ type: String, ref: 'Project' }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);
  