
const projectInvitationSchema = new mongoose.Schema({
    _id: { type: String, default: cuid },
    projectId: { type: String, ref: 'Project' },
    userId: { type: String, ref: 'User' },
    status: { type: String, default: 'pending' }
  }, { timestamps: true });
  
  projectInvitationSchema.index({ projectId: 1, userId: 1 }, { unique: true });
  