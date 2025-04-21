
const technologySchema = new mongoose.Schema({
    _id: { type: String, default: cuid },
    name: { type: String, unique: true },
    category: String,
    description: String
}, { timestamps: true });
  