import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    views: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model('PageView', pageViewSchema);
