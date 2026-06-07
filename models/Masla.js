import mongoose from 'mongoose';

const maslaSchema = new mongoose.Schema(
  {
    slug: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true,
      index: true 
    },
    question: { 
      type: String, 
      required: true 
    },
    answer: { 
      type: String, 
      required: true 
    },
    authority: { 
      type: String, 
      default: 'Darul Ifta' 
    },
    reference: { 
      type: String 
    },
    category: { 
      type: String, 
      required: true,
      default: 'General',
      index: true 
    },
    views: { 
      type: Number, 
      default: 0 
    }
  },
  { timestamps: true }
);

export default mongoose.model('Masla', maslaSchema);
