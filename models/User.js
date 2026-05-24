import mongoose from 'mongoose';

const qazaRecordSchema = new mongoose.Schema({
  fajr:     { type: Number, default: 0, min: 0 },
  zohar:    { type: Number, default: 0, min: 0 },
  asr:      { type: Number, default: 0, min: 0 },
  maghrib:  { type: Number, default: 0, min: 0 },
  ishaFarz: { type: Number, default: 0, min: 0 },
  ishaWitr: { type: Number, default: 0, min: 0 },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    googleId:   { type: String, required: true, unique: true },
    email:      { type: String, required: true },
    name:       { type: String, required: true },
    avatar:     { type: String },
    qazaRecord: { type: qazaRecordSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
