'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/landing/Navbar';
import ThemePicker from '@/components/book/ThemePicker';
import QuestionBuilder from '@/components/book/QuestionBuilder';
import LivePreview from '@/components/book/LivePreview';
import { defaultQuestions } from '@/lib/themes';

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('pastel');
  const [questions, setQuestions] = useState(defaultQuestions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1=details, 2=questions, 3=theme

  // Show login prompt if not signed in
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 text-center shadow-xl max-w-md mx-4"
        >
          <p className="text-5xl mb-4">🔒</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in first!</h2>
          <p className="text-gray-500 mb-6">You need to be signed in to create a slam book.</p>
          <button
            onClick={() => signIn('google')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold w-full"
          >
            Continue with Google
          </button>
        </motion.div>
      </div>
    );
  }

  const handleCreate = async () => {
    if (!title.trim()) {
      setError('Please give your slam book a title!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, theme, questions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Details' },
    { num: 2, label: 'Questions' },
    { num: 3, label: 'Theme' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Slam Book ✨
          </h1>
          <p className="text-gray-500">Customize it, share it, collect memories.</p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <button
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  step === s.num
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : step > s.num
                    ? 'bg-green-100 text-green-600'
                    : 'bg-white text-gray-400 border border-gray-200'
                }`}
              >
                {step > s.num ? '✓' : s.num} {s.label}
              </button>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${step > s.num ? 'bg-green-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1: Details */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-6">📋 Book Details</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Title <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Arjun's Slam Book 2024 🌟"
                      maxLength={100}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors text-gray-800 font-medium"
                    />
                    <p className="text-xs text-gray-400 mt-1">{title.length}/100</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Description <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell your friends what this is about..."
                      rows={3}
                      maxLength={500}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors text-gray-800 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{description.length}/500</p>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm font-medium bg-red-50 px-4 py-2 rounded-xl"
                    >
                      ⚠️ {error}
                    </motion.p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3.5 rounded-2xl font-bold text-lg shadow-lg"
                  >
                    Next: Add Questions →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Questions */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">❓ Questions</h2>
                  <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {questions.length} questions
                  </span>
                </div>

                <QuestionBuilder questions={questions} onChange={setQuestions} />

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-gray-500 hover:border-gray-300">
                    ← Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(3)}
                    className="flex-2 flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl font-bold shadow-lg"
                  >
                    Next: Pick Theme →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Theme + Create */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-6">🎨 Choose Theme</h2>

                <ThemePicker selected={theme} onSelect={setTheme} />

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-gray-500">
                    ← Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-2xl font-bold shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : '🚀 Create Slam Book!'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Live Preview */}
          <div className="hidden lg:block">
            <LivePreview
              title={title}
              description={description}
              theme={theme}
              questions={questions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}