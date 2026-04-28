import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true, maxlength: 300 },
  type: { type: String, enum: ['text', 'emoji-rating', 'multiple-choice', 'color-picker'], default: 'text' },
  options: [String],
  required: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const BookSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 500, default: '' },
  slug: { type: String, required: true, unique: true, lowercase: true },
  theme: { type: String, enum: ['retro', 'minimal', 'neon', 'pastel'], default: 'pastel' },
  questions: [QuestionSchema],
  isActive: { type: Boolean, default: true },
  responseCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model('Book', BookSchema);