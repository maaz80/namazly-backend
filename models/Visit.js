import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema(
  {
    sessionToken: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    visitorId: {
      type: String,
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    email: {
      type: String,
      required: false
    },
    ip: {
      type: String,
      required: true
    },
    userAgent: {
      type: String
    },
    calculatedNamaz: {
      type: Boolean,
      default: false
    },
    isPwaInstall: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Index on createdAt for range filtering and aggregation
visitSchema.index({ createdAt: 1 });

export default mongoose.model('Visit', visitSchema);
