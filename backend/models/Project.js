// models/Project.js
import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    visibility: { type: String, default: 'public' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    technologies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technology' }],
    members: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, default: 'member' }
    }]
  }, { timestamps: true });
  export default mongoose.model('Project', projectSchema);