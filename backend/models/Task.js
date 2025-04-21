// models/Task.js
const taskSchema = new mongoose.Schema({
    _id: { type: String, default: cuid },
    title: String,
    description: String,
    status: { type: String, default: 'pending' },
    projectId: { type: String, ref: 'Project' },
    assigneeId: { type: String, ref: 'User' }
  }, { timestamps: true });
  