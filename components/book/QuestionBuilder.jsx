'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

const questionTypes = [
  { value: 'text', label: '📝 Text Answer' },
  { value: 'emoji-rating', label: '⭐ Emoji Rating' },
  { value: 'multiple-choice', label: '🎯 Multiple Choice' },
  { value: 'color-picker', label: '🎨 Color Picker' },
];

function QuestionItem({ question, onUpdate, onDelete, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Reorder.Item value={question} id={question.id}>
      <motion.div
        layout
        className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-pink-200 transition-colors"
      >
        {/* Question header - drag handle + summary */}
        <div className="flex items-center gap-3 p-4">
          {/* Drag handle */}
          <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm8-16a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z"/>
            </svg>
          </div>

          <span className="text-xs font-bold text-pink-400 bg-pink-50 px-2 py-1 rounded-lg">
            Q{index + 1}
          </span>

          <p className="flex-1 text-gray-700 font-medium text-sm truncate">
            {question.text || 'Untitled question'}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-pink-500 transition-colors"
            >
              <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(question.id)}
              className="text-gray-300 hover:text-red-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Expanded editor */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 p-4 space-y-3"
            >
              {/* Question text */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Question</label>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => onUpdate(question.id, { text: e.target.value })}
                  placeholder="Ask something fun..."
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400 transition-colors"
                />
              </div>

              {/* Question type */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</label>
                <select
                  value={question.type}
                  onChange={(e) => onUpdate(question.id, { type: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400 bg-white"
                >
                  {questionTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Multiple choice options */}
              {question.type === 'multiple-choice' && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Options</label>
                  <div className="mt-1 space-y-2">
                    {(question.options || []).map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...(question.options || [])];
                            newOptions[i] = e.target.value;
                            onUpdate(question.id, { options: newOptions });
                          }}
                          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                          placeholder={`Option ${i + 1}`}
                        />
                        <button
                          onClick={() => {
                            const newOptions = question.options.filter((_, idx) => idx !== i);
                            onUpdate(question.id, { options: newOptions });
                          }}
                          className="text-gray-300 hover:text-red-400"
                        >✕</button>
                      </div>
                    ))}
                    <button
                      onClick={() => onUpdate(question.id, { options: [...(question.options || []), ''] })}
                      className="text-xs text-pink-500 font-semibold hover:text-pink-600"
                    >
                      + Add option
                    </button>
                  </div>
                </div>
              )}

              {/* Required toggle */}
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Required</label>
                <button
                  onClick={() => onUpdate(question.id, { required: !question.required })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${question.required ? 'bg-pink-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${question.required ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reorder.Item>
  );
}

export default function QuestionBuilder({ questions, onChange }) {
  const addQuestion = () => {
    const newQ = {
      id: 'q_' + Date.now(),
      text: '',
      type: 'text',
      options: [],
      required: false,
      order: questions.length,
    };
    onChange([...questions, newQ]);
  };

  const updateQuestion = (id, updates) => {
    onChange(questions.map((q) => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-3">
      <Reorder.Group
        axis="y"
        values={questions}
        onReorder={onChange}
        className="space-y-3"
      >
        <AnimatePresence>
          {questions.map((q, index) => (
            <QuestionItem
              key={q.id}
              question={q}
              index={index}
              onUpdate={updateQuestion}
              onDelete={deleteQuestion}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addQuestion}
        className="w-full py-3 border-2 border-dashed border-pink-200 rounded-2xl text-pink-400 font-semibold hover:border-pink-400 hover:bg-pink-50 transition-all flex items-center justify-center gap-2"
      >
        <span className="text-xl">+</span> Add Question
      </motion.button>
    </div>
  );
}