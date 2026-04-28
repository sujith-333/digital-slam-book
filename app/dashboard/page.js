'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import { themes } from '@/lib/themes';

function BookCard({ book, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const theme = themes[book.theme] || themes.pastel;
  const shareUrl = `${window.location.origin}/book/${book.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this slam book? This cannot be undone.')) return;
    setDeleting(true);
    await fetch(`/api/books/${book.id}`, { method: 'DELETE' });
    onDelete(book.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
    >
      {/* Theme color bar */}
      <div className={`h-3 bg-gradient-to-r ${theme.gradient}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{theme.emoji}</span>
              <h3 className="font-bold text-gray-800 text-lg truncate">{book.title}</h3>
            </div>
            {book.description && (
              <p className="text-gray-400 text-sm truncate">{book.description}</p>
            )}
          </div>
          {/* Active badge */}
          <span className={`ml-2 shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
            book.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {book.is_active ? '● Active' : '○ Closed'}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="text-lg">💌</span>
            <span className="font-bold text-gray-800">{book.response_count}</span>
            <span className="text-sm">responses</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="text-lg">❓</span>
            <span className="font-bold text-gray-800">{book.questions?.length || 0}</span>
            <span className="text-sm">questions</span>
          </div>
        </div>

        {/* Share link box */}
        <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-400 truncate flex-1 font-mono">
            /book/{book.slug}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={copyLink}
            className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-white text-pink-500 border border-pink-200 hover:bg-pink-50'
            }`}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </motion.button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Link href={`/dashboard/${book.id}`} className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-pink-200 transition-all"
            >
              📊 View Responses
            </motion.button>
          </Link>
          <Link href={`/book/${book.slug}`} target="_blank" className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-gray-500 hover:border-pink-300 hover:text-pink-500 transition-all text-sm"
            >
              👁️
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-2.5 border-2 border-gray-200 rounded-xl text-gray-400 hover:border-red-200 hover:text-red-400 transition-all text-sm disabled:opacity-50"
          >
            {deleting ? '...' : '🗑️'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) fetchBooks();
  }, [session]);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data.books || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  // Not logged in
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
          <p className="text-gray-500 mb-6">You need to be signed in to view your dashboard.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              My Slam Books 📖
            </h1>
            <p className="text-gray-500 mt-1">
              {books.length > 0
                ? `You have ${books.length} slam book${books.length > 1 ? 's' : ''}`
                : 'Create your first slam book!'}
            </p>
          </div>
          <Link href="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-pink-200 transition-all flex items-center gap-2"
            >
              <span className="text-xl">+</span> New Book
            </motion.button>
          </Link>
        </motion.div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg">
                <div className="h-3 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded-xl animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-xl animate-pulse w-full" />
                  <div className="h-4 bg-gray-100 rounded-xl animate-pulse w-1/2" />
                  <div className="h-10 bg-gray-200 rounded-xl animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && books.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="text-8xl mb-6">📭</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">No slam books yet!</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first slam book and start collecting memories from your friends.
            </p>
            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl"
              >
                ✨ Create My First Slam Book
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Books grid */}
        {!loading && books.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {books.map((book) => (
                <BookCard key={book.id} book={book} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}