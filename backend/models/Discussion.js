
const discussionSchema = new mongoose.Schema({
    _id: { type: String, default: cuid },
    title: String,
    content: String,
    projectId: { type: String, ref: 'Project' },
    authorId: { type: String, ref: 'User' },
    comments: [{ type: String, ref: 'Comment' }]
  }, { timestamps: true });
  