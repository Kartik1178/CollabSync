// models/Project.js
import Task from "./Task.js";
import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    visibility: { type: String, default: 'public' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    technologies: [String],
    members: [{ 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, default: 'member' }
    }],
    joinRequests: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
      requestedAt: { type: Date, default: Date.now }
    }]
  }, { timestamps: true });
  projectSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'projectId'
  });
  
projectSchema.set('toObject', { virtuals: true });
projectSchema.set('toJSON', { virtuals: true });
  export default mongoose.model('Project', projectSchema);