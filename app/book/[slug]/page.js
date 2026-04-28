'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { themes } from '@/lib/themes';

// ── Progress bar ──────────────────────────────────────────
function ProgressBar({ current, total, theme }) {
  const t = themes[theme] || themes.pastel;
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xs font-semibold mb-2 text-gray-400">
        <span>Question {current} of {total}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${t.gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ── Individual question card ───────────────────────────────
function QuestionCard({ question, answer, onChange, theme }) {
  const t = themes[theme] || themes.pastel;
  const emojis = ['😐', '🙂', '😊', '😄', '🤩'];
  const colors = ['#FF6B6B','#FF9F43','#FFEAA7','#55EFC4','#74B9FF','#A29BFE','#FD79A8','#636E72'];

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`${t.card} rounded-3xl p-8 w-full`}
    >
      {/* Required badge */}
      {question.required && (
        <span className="text-xs font-bold text-pink-400 bg-pink-50 px-3 py-1 rounded-full mb-4 inline-block">
          Required ✦
        </span>
      )}

      {/* Question text */}
      <h2 className={`text-xl font-bold ${t.text} mb-6 leading-snug`}>
        {question.text}
      </h2>

      {/* Text answer */}
      {question.type === 'text' && (
        <textarea
          value={answer || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here... ✍️"
          rows={4}
          className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-pink-400 resize-none transition-colors text-gray-700 bg-white/80 ${t.font}`}
        />
      )}

      {/* Emoji rating */}
      {question.type === 'emoji-rating' && (
        <div className="flex justify-center gap-4">
          {emojis.map((emoji, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange(i + 1)}
              className={`text-4xl transition-all ${
                answer === i + 1 ? 'scale-125 drop-shadow-lg' : 'opacity-50'
              }`}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      )}

      {/* Multiple choice */}
      {question.type === 'multiple-choice' && (
        <div className="space-y-3">
          {question.options?.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(opt)}
              className={`w-full text-left px-5 py-3.5 rounded-2xl border-2 font-medium transition-all ${
                answer === opt
                  ? 'border-pink-400 bg-pink-50 text-pink-600'
                  : 'border-gray-200 bg-white hover:border-pink-200 text-gray-700'
              }`}
            >
              {answer === opt && <span className="mr-2">✓</span>}
              {opt}
            </motion.button>
          ))}
        </div>
      )}

      {/* Color picker */}
      {question.type === 'color-picker' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {colors.map((color) => (
              <motion.button
                key={color}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onChange(color)}
                className={`w-12 h-12 rounded-full border-4 transition-all ${
                  answer === color ? 'border-gray-800 scale-110' : 'border-white shadow-md'
                }`}
                style={{ background: color }}
              />
            ))}
          </div>
          {answer && (
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full shadow-md border-2 border-white" style={{ background: answer }} />
              <span className="text-sm font-mono text-gray-500">{answer}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Main Fill Page ─────────────────────────────────────────
export default function FillPage() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [responderName, setResponderName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [vibe, setVibe] = useState('');
  const [signatureColor, setSignatureColor] = useState('#6366f1');
  const [signatureEmoji, setSignatureEmoji] = useState('✨');

  // UI state
  const [shake, setShake] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState('intro'); // intro → questions → outro → submitted

  useEffect(() => {
    fetchBook();
  }, [slug]);

  const fetchBook = async () => {
    try {
      const res = await fetch(`/api/books/${slug}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBook(data.book);
      // Pre-fill answers object
      const initial = {};
      data.book.questions.forEach((q) => { initial[q.id] = ''; });
      setAnswers(initial);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = book?.questions?.[currentQ];
  const theme = book?.theme || 'pastel';
  const t = themes[theme] || themes.pastel;

  const handleNext = () => {
    // Validate required
    if (currentQuestion?.required && !answers[currentQuestion.id]) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (currentQ < book.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase('outro');
    }
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
    else setPhase('intro');
  };

  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#FF6B9D', '#C44DFF', '#4DFFB4'] });
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 60, origin: { x: 0 } }), 300);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 } }), 500);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = book.questions.map((q) => ({
        questionId: q.id,
        questionText: q.text,
        answer: answers[q.id] || '',
      }));

      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          responderName,
          isAnonymous,
          answers: formattedAnswers,
          vibe,
          signature: { color: signatureColor, emoji: signatureEmoji },
        }),
      });

      if (!res.ok) throw new Error('Failed to submit');
      fireConfetti();
      setPhase('submitted');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-pink-300 border-t-pink-500 rounded-full"
        />
      </div>
    );
  }

  // ── Error ──
  if (error || !book) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Book not found</h2>
          <p className="text-gray-400">{error || 'This slam book does not exist.'}</p>
        </div>
      </div>
    );
  }

  // ── Submitted ──
  if (phase === 'submitted') {
    return (
      <div className={`min-h-screen ${t.bg} flex items-center justify-center p-6`}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          <h2 className={`text-3xl font-bold ${t.text} mb-3`}>You're amazing!</h2>
          <p className={`${t.text} opacity-70 mb-2`}>
            Your response has been sent to
          </p>
          <p className={`text-2xl font-bold ${t.text} mb-6`}>{book.title} 💌</p>
          <div className={`${t.card} rounded-2xl p-4 text-sm ${t.text} opacity-60`}>
            They'll cherish your words forever ✨
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Intro screen ──
  if (phase === 'intro') {
    return (
      <div className={`min-h-screen ${t.bg} flex items-center justify-center p-6`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Book header card */}
          <div className={`${t.card} rounded-3xl p-8 mb-5 text-center`}>
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4 bg-gradient-to-r ${t.gradient} text-gray-700`}>
              📖 Slam Book
            </div>
            <h1 className={`text-3xl font-bold ${t.text} ${t.font} mb-2`}>{book.title}</h1>
            {book.description && (
              <p className={`${t.text} opacity-60 text-sm mt-2`}>{book.description}</p>
            )}
            <div className={`mt-4 text-sm ${t.text} opacity-50`}>
              {book.questions.length} questions · {book.response_count} responses
            </div>
          </div>

          {/* Name input */}
          <div className={`${t.card} rounded-3xl p-6 mb-4`}>
            <label className={`block text-sm font-bold ${t.text} mb-3`}>
              What's your name? 👋
            </label>
            <input
              type="text"
              value={responderName}
              onChange={(e) => setResponderName(e.target.value)}
              disabled={isAnonymous}
              placeholder="Your name..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-pink-400 transition-colors bg-white/80 disabled:opacity-40"
            />
            <label className="flex items-center gap-3 mt-3 cursor-pointer">
              <div
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-10 h-5 rounded-full transition-colors relative ${isAnonymous ? 'bg-pink-500' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAnonymous ? 'translate-x-5' : ''}`} />
              </div>
              <span className={`text-sm font-medium ${t.text} opacity-70`}>Stay anonymous 🎭</span>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPhase('questions')}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl ${t.primary}`}
          >
            Let's Go! 🚀
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Outro screen ──
  if (phase === 'outro') {
    const vibeOptions = ["feeling nostalgic 🌙", "full of love 💕", "being chaotic 🌪️", "in my feels 🥺", "absolutely thriving ✨"];
    const emojis = ['✨', '💜', '🌸', '🔥', '🌙', '⚡', '🦋', '🎯'];

    return (
      <div className={`min-h-screen ${t.bg} flex items-center justify-center p-6`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-4"
        >
          <div className="text-center mb-6">
            <p className="text-4xl mb-2">🎨</p>
            <h2 className={`text-2xl font-bold ${t.text}`}>Almost done!</h2>
            <p className={`${t.text} opacity-60 text-sm mt-1`}>Add your personal touch</p>
          </div>

          {/* Vibe */}
          <div className={`${t.card} rounded-3xl p-5`}>
            <label className={`block text-sm font-bold ${t.text} mb-3`}>Your vibe right now? ✨</label>
            <div className="flex flex-wrap gap-2">
              {vibeOptions.map((v) => (
                <button
                  key={v}
                  onClick={() => setVibe(v === vibe ? '' : v)}
                  className={`text-xs px-3 py-2 rounded-xl border-2 font-medium transition-all ${
                    vibe === v ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-gray-200 text-gray-500 hover:border-pink-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Signature emoji */}
          <div className={`${t.card} rounded-3xl p-5`}>
            <label className={`block text-sm font-bold ${t.text} mb-3`}>Pick your signature emoji</label>
            <div className="flex gap-3 flex-wrap">
              {emojis.map((e) => (
                <button
                  key={e}
                  onClick={() => setSignatureEmoji(e)}
                  className={`text-2xl transition-all ${signatureEmoji === e ? 'scale-125' : 'opacity-50 hover:opacity-80'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl ${t.primary} disabled:opacity-60 flex items-center justify-center gap-2`}
          >
            {submitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : <span>💌 Send to {book.title}</span>}
          </motion.button>

          <button onClick={() => { setPhase('questions'); setCurrentQ(book.questions.length - 1); }}
            className={`w-full text-center text-sm ${t.text} opacity-50 hover:opacity-80`}>
            ← Go back
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Questions phase ──
  return (
    <div className={`min-h-screen ${t.bg} flex flex-col items-center justify-center p-6`}>
      <div className="w-full max-w-lg">
        {/* Progress */}
        <ProgressBar current={currentQ + 1} total={book.questions.length} theme={theme} />

        {/* Question card */}
        <div className={shake ? 'animate-shake' : ''}>
          <AnimatePresence mode="wait">
            <QuestionCard
              key={currentQ}
              question={currentQuestion}
              answer={answers[currentQuestion?.id]}
              onChange={(val) => setAnswers({ ...answers, [currentQuestion.id]: val })}
              theme={theme}
            />
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleBack}
            className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold text-gray-500 hover:border-pink-300"
          >
            ← Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            className={`flex-1 py-3 rounded-2xl font-bold text-lg shadow-lg ${t.primary}`}
          >
            {currentQ === book.questions.length - 1 ? 'Almost done! →' : 'Next →'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}