
// models/Comment.js
const commentSchema = new mongoose.Schema({
    _id: { type: String, default: cuid },
    content: String,
    discussionId: { type: String, ref: 'Discussion' },
    authorId: { type: String, ref: 'User' }
  }, { timestamps: true });
  