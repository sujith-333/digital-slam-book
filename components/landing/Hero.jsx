'use client';

import { motion } from 'framer-motion';
import { useSession, signIn } from 'next-auth/react';
import { TypeAnimation } from 'react-type-animation';
import Link from 'next/link';

// Floating emoji decorations around the hero
const floatingEmojis = [
  { emoji: '💌', x: '10%', y: '20%', delay: 0 },
  { emoji: '✨', x: '85%', y: '15%', delay: 0.5 },
  { emoji: '🌸', x: '75%', y: '70%', delay: 1 },
  { emoji: '💜', x: '15%', y: '75%', delay: 1.5 },
  { emoji: '📖', x: '90%', y: '45%', delay: 0.8 },
  { emoji: '🎉', x: '5%', y: '50%', delay: 1.2 },
];

export default function Hero() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"
        />
      </div>

      {/* Floating emojis */}
      {floatingEmojis.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { delay: item.delay, duration: 0.5 },
            scale: { delay: item.delay, duration: 0.5 },
            y: { delay: item.delay, duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute text-3xl select-none pointer-events-none hidden md:block"
          style={{ left: item.x, top: item.y }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-pink-200 shadow-sm mb-8"
        >
          <span className="text-sm">🎉</span>
          <span className="text-sm font-medium text-gray-600">
            The modern way to collect memories
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
        >
          Your friends say the{' '}
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
            <TypeAnimation
              sequence={[
                'funniest', 2000,
                'sweetest', 2000,
                'wildest', 2000,
                'realest', 2000,
              ]}
              repeat={Infinity}
              speed={50}
            />
          </span>
          {' '}things 📖
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Create your personal slam book, share the link with friends,
          and collect beautiful memories — all in one place. ✨
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {session ? (
            <>
              <Link href="/create">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-pink-200/60 transition-all"
                >
                  ✨ Create My Slam Book
                </motion.button>
              </Link>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-pink-300 hover:text-pink-500 transition-all shadow-lg"
                >
                  📊 My Dashboard
                </motion.button>
              </Link>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => signIn('google')}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-pink-200/60 transition-all flex items-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => signIn('google')}
                className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-gray-200 hover:border-pink-300 hover:text-pink-500 transition-all shadow-lg"
              >
                👀 See How It Works
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex items-center justify-center gap-3 text-gray-400"
        >
          <div className="flex -space-x-2">
            {['🧑', '👩', '🧒', '👨', '👧'].map((emoji, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 border-2 border-white flex items-center justify-center text-sm">
                {emoji}
              </div>
            ))}
          </div>
          <p className="text-sm font-medium">
            Join <span className="text-pink-500 font-bold">2,000+</span> people collecting memories
          </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
}