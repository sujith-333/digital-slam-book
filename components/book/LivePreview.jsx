'use client';

import { motion } from 'framer-motion';
import { themes } from '@/lib/themes';

export default function LivePreview({ title, description, theme, questions }) {
  const t = themes[theme] || themes.pastel;

  return (
    <div className="sticky top-24">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">
        Live Preview
      </p>

      {/* Phone mockup */}
      <div className="mx-auto w-64 bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        <div className={`rounded-[2rem] overflow-hidden ${t.bg} min-h-[500px]`}>

          {/* Status bar */}
          <div className="bg-black/10 px-4 py-1 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-600">9:41</span>
            <div className="flex gap-1">
              <div className="w-3 h-1.5 bg-gray-600 rounded-sm" />
              <div className="w-1 h-1.5 bg-gray-600 rounded-sm" />
            </div>
          </div>

          <div className="p-4">
            {/* Book header */}
            <div className="text-center mb-4">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-gradient-to-r ${t.gradient} text-gray-700`}>
                📖 Slam Book
              </div>
              <h3 className={`font-bold text-lg ${t.text} ${t.font} leading-tight`}>
                {title || 'My Slam Book'}
              </h3>
              {description && (
                <p className={`text-xs mt-1 opacity-70 ${t.text}`}>{description}</p>
              )}
            </div>

            {/* Questions preview */}
            <div className="space-y-2">
              {questions.slice(0, 3).map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`${t.card} rounded-xl p-3`}
                >
                  <p className={`text-xs font-semibold ${t.text} opacity-60 mb-1`}>Q{i + 1}</p>
                  <p className={`text-xs ${t.text} leading-snug`}>
                    {q.text || 'Your question here...'}
                  </p>
                  {/* Answer preview based on type */}
                  {q.type === 'emoji-rating' && (
                    <div className="flex gap-1 mt-2">
                      {['😐','🙂','😊','😄','🤩'].map((e, idx) => (
                        <span key={idx} className="text-sm opacity-40">{e}</span>
                      ))}
                    </div>
                  )}
                  {q.type === 'color-picker' && (
                    <div className="flex gap-1 mt-2">
                      {['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7'].map((c) => (
                        <div key={c} className="w-4 h-4 rounded-full opacity-60" style={{ background: c }} />
                      ))}
                    </div>
                  )}
                  {q.type === 'multiple-choice' && q.options?.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {q.options.slice(0, 2).map((opt, idx) => (
                        <div key={idx} className="text-xs bg-black/5 rounded-lg px-2 py-1 opacity-60">{opt}</div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              {questions.length > 3 && (
                <p className={`text-xs text-center opacity-40 ${t.text}`}>
                  +{questions.length - 3} more questions
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Theme label */}
      <p className="text-center text-xs text-gray-400 mt-3">
        {themes[theme]?.emoji} {themes[theme]?.name} theme
      </p>
    </div>
  );
}