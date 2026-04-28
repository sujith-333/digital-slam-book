'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {

    title: '4 Immersive Themes',
    description: 'Retro 90s, Minimal, Neon Night, Pastel Dream — your book, your vibe.',
    color: 'from-pink-400 to-rose-400',
    bg: 'bg-pink-50',
  },
  {
    title: 'Share Instantly',
    description: 'Get a unique link. Share with your squad. Start collecting memories in seconds.',
    color: 'from-purple-400 to-indigo-400',
    bg: 'bg-purple-50',
  },
  {
    title: 'Anonymous or Named',
    description: 'Friends can respond anonymously or put their name on it. Their choice!',
    color: 'from-blue-400 to-cyan-400',
    bg: 'bg-blue-50',
  },
  {
    title: 'Beautiful board',
    description: 'See all responses in a stunning polaroid-style masonry grid.',
    color: 'from-amber-400 to-orange-400',
    bg: 'bg-amber-50',
  },
  {
    title: 'Share as Image',
    description: 'Export responses as Spotify Wrapped-style cards and share anywhere.',
    color: 'from-green-400 to-teal-400',
    bg: 'bg-green-50',
  },
  {
    title: 'Confetti & Animations',
    description: 'Micro-interactions and delightful animations make every click feel special.',
    color: 'from-red-400 to-pink-400',
    bg: 'bg-red-50',
  },
];

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`${feature.bg} rounded-2xl p-6 border border-white shadow-lg hover:shadow-xl transition-shadow cursor-default`}
    >
     
      <h3 className="font-bold text-gray-800 text-lg mb-2">{feature.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-pink-500 uppercase tracking-wider">Everything you need</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
            Built for{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              memories
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Everything you need to collect, store, and cherish your friendships forever.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* Themes preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-gray-400 text-sm font-medium mb-6 uppercase tracking-wider">Choose your theme</p>
          <div className="flex flex-wrap justify-center gap-4">
                    {[
            { name: 'Retro 90s', colors: 'from-yellow-300 via-pink-300 to-cyan-300' },
            { name: 'Minimal', colors: 'from-gray-100 via-white to-gray-200' },
            { name: 'Neon Night', colors: 'from-purple-900 via-blue-900 to-cyan-900' },
            { name: 'Pastel Dream', colors: 'from-pink-200 via-purple-100 to-blue-200' },
          ].map((theme) => (
            <motion.div
              key={theme.name}
              whileHover={{ scale: 1.08, y: -4 }}
              className={`
                bg-gradient-to-r ${theme.colors}
                px-6 py-3 rounded-2xl font-semibold shadow-lg cursor-pointer border border-white
                ${theme.name === "Neon Night" ? "text-white" : "text-gray-700"}
              `}
            >
              {theme.name}
            </motion.div>
          ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}