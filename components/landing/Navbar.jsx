'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add shadow when user scrolls down
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg shadow-pink-100/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">📖</span>
            <span className="font-display text-xl bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              SlamBook
            </span>
          </motion.div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {session ? (
            <>
              <Link href="/dashboard">
                <motion.span
                  whileHover={{ y: -2 }}
                  className="text-gray-600 hover:text-pink-500 font-medium transition-colors cursor-pointer"
                >
                  My Books
                </motion.span>
              </Link>
              <Link href="/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:shadow-pink-200 transition-all"
                >
                  + Create Book
                </motion.button>
              </Link>
              {/* Avatar + sign out */}
              <motion.div whileHover={{ scale: 1.05 }} className="relative group">
                <img
                  src={session.user.image || '/default-avatar.png'}
                  alt={session.user.name}
                  className="w-9 h-9 rounded-full border-2 border-pink-200 cursor-pointer"
                />
                <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 p-3 min-w-[160px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <p className="text-sm font-medium text-gray-800 truncate">{session.user.name}</p>
                  <p className="text-xs text-gray-400 truncate mb-2">{session.user.email}</p>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-red-400 hover:text-red-500 font-medium w-full text-left"
                  >
                    Sign out
                  </button>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => signIn('google')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-pink-200 transition-all flex items-center gap-2"
            >
              <span>✨</span> Get Started
            </motion.button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3"
          >
            {session ? (
              <>
                <Link href="/dashboard" className="block text-gray-700 font-medium py-2">My Books</Link>
                <Link href="/create" className="block text-pink-500 font-semibold py-2">+ Create Book</Link>
                <button onClick={() => signOut()} className="block text-red-400 font-medium py-2">Sign out</button>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold"
              >
                ✨ Get Started
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}