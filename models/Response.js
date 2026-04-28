import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  answer: { type: mongoose.Schema.Types.Mixed, required: true },
});

const ResponseSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  responderName: { type: String, default: 'Anonymous', maxlength: 50 },
  isAnonymous: { type: Boolean, default: false },
  answers: [AnswerSchema],
  vibe: { type: String, maxlength: 100, default: '' },
  signature: {
    color: { type: String, default: '#6366f1' },
    emoji: { type: String, default: '✨' },
  },
}, { timestamps: true });

export default mongoose.models.Response || mongoose.model('Response', ResponseSchema);