'use client';

import { motion } from 'framer-motion';
import { themes } from '@/lib/themes';

export default function ThemePicker({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Object.values(themes).map((theme) => (
        <motion.button
          key={theme.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(theme.id)}
          className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
            selected === theme.id
              ? 'border-pink-400 shadow-lg shadow-pink-100'
              : 'border-gray-200 hover:border-pink-200'
          }`}
        >
          {/* Theme gradient preview bar */}
          <div className={`h-8 rounded-lg bg-gradient-to-r ${theme.gradient} mb-3`} />
          <div className="flex items-center gap-2">
            <span className="text-lg">{theme.emoji}</span>
            <span className="font-semibold text-gray-700 text-sm">{theme.name}</span>
          </div>
          {/* Selected checkmark */}
          {selected === theme.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}