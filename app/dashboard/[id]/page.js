'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import { themes } from '@/lib/themes';

// ── Single Response Card (Polaroid style) ─────────────────
function ResponseCard({ response, book, index }) {
  const theme = themes[book.theme] || themes.pastel;
  const t = theme;
  const cardRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [sharing, setSharing] = useState(false);

  const date = new Date(response.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  const shareAsImage = async () => {
    setSharing(true);
    try {
      const dataUrl = await toPng(cardRef.current, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `slambook-response-${index + 1}.png`;
      link.href = dataUrl;
      link.click();
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
    } catch (err) {
      console.error(err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
      whileHover={{ rotate: 0, scale: 1.02, zIndex: 10 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="break-inside-avoid mb-6"
    >
      {/* Polaroid card */}
      <div
        ref={cardRef}
        className={`${t.card} rounded-2xl overflow-hidden shadow-lg`}
      >
        {/* Color header bar with signature */}
        <div
          className="h-16 flex items-center justify-between px-5"
          style={{ background: `linear-gradient(135deg, ${response.signature?.color || '#6366f1'}22, ${response.signature?.color || '#6366f1'}44)` }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md"
              style={{ background: response.signature?.color || '#6366f1' }}
            >
              {response.is_anonymous ? '?' : (response.responder_name?.[0]?.toUpperCase() || '?')}
            </div>
            <div>
              <p className={`font-bold text-sm ${t.text}`}>
                {response.is_anonymous ? 'Anonymous 🎭' : response.responder_name}
              </p>
              <p className={`text-xs ${t.text} opacity-50`}>{date}</p>
            </div>
          </div>
          <span className="text-2xl">{response.signature?.emoji || '✨'}</span>
        </div>

        {/* Answers */}
        <div className="p-5 space-y-4">
          {/* Vibe badge */}
          {response.vibe && (
            <div className="inline-block bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 text-xs font-bold px-3 py-1.5 rounded-full">
              {response.vibe}
            </div>
          )}

          {/* Show first 2 answers always, rest on expand */}
          {response.answers?.slice(0, expanded ? undefined : 2).map((ans, i) => (
            <div key={i} className="space-y-1">
              <p className={`text-xs font-semibold ${t.text} opacity-50 uppercase tracking-wide`}>
                {ans.questionText}
              </p>
              {/* Render answer based on type */}
              {typeof ans.answer === 'number' ? (
                // Emoji rating
                <p className="text-xl">
                  {['😐','🙂','😊','😄','🤩'][ans.answer - 1] || ans.answer}
                </p>
              ) : ans.answer?.startsWith?.('#') ? (
                // Color picker
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full shadow-sm border border-white" style={{ background: ans.answer }} />
                  <span className={`text-xs font-mono ${t.text} opacity-60`}>{ans.answer}</span>
                </div>
              ) : (
                // Text or multiple choice
                <p className={`text-sm ${t.text} font-medium leading-relaxed`}>
                  {ans.answer || <span className="opacity-30 italic">No answer</span>}
                </p>
              )}
            </div>
          ))}

          {/* Expand/collapse */}
          {response.answers?.length > 2 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className={`text-xs font-bold ${t.text} opacity-50 hover:opacity-80 transition-opacity`}
            >
              {expanded ? '▲ Show less' : `▼ +${response.answers.length - 2} more answers`}
            </button>
          )}
        </div>

        {/* Share button */}
        <div className="px-5 pb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={shareAsImage}
            disabled={sharing}
            className="w-full py-2 text-xs font-bold border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-pink-300 hover:text-pink-400 transition-all"
          >
            {sharing ? '⏳ Saving...' : '📸 Save as Image'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Responses Page ────────────────────────────────────
export default function ResponsesPage() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('all'); // all | named | anonymous

  useEffect(() => {
    if (status === 'authenticated') fetchData();
  }, [status, id]);

  const fetchData = async () => {
    try {
      // Fetch book
      const bookRes = await fetch(`/api/books/${id}`);
      const bookData = await bookRes.json();
      if (!bookRes.ok) throw new Error(bookData.error);
      setBook(bookData.book);

      // Fetch responses
       // Use the book's actual UUID id for responses
      const bookUUID = bookData.book.id;
      const respRes = await fetch(`/api/responses/${bookUUID}`);
      const respData = await respRes.json();
      if (!respRes.ok) throw new Error(respData.error);
      setResponses(respData.responses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/book/${book?.slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleActive = async () => {
    const res = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !book.is_active }),
    });
    const data = await res.json();
    setBook(data.book);
  };

  const filteredResponses = responses.filter((r) => {
    if (filter === 'named') return !r.is_anonymous;
    if (filter === 'anonymous') return r.is_anonymous;
    return true;
  });

  const theme = themes[book?.theme] || themes.pastel;
  const t = theme;

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-pink-300 border-t-pink-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-gray-600 font-medium">{error}</p>
          <Link href="/dashboard">
            <button className="mt-4 text-pink-500 font-semibold hover:underline">← Back to Dashboard</button>
          </Link>
        </div>
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
          className="mb-8"
        >
          <Link href="/dashboard">
            <button className="text-sm text-gray-400 hover:text-pink-500 font-medium mb-4 flex items-center gap-1">
              ← Back to Dashboard
            </button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{t.emoji}</span>
                <h1 className="text-3xl font-bold text-gray-900">{book?.title}</h1>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  book?.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  {book?.is_active ? '● Active' : '○ Closed'}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {responses.length} response{responses.length !== 1 ? 's' : ''} collected
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={copyShareLink}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${
                  copied ? 'bg-green-500 text-white border-green-500' : 'bg-white border-gray-200 text-gray-600 hover:border-pink-300'
                }`}
              >
                {copied ? '✓ Copied!' : '🔗 Copy Link'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={toggleActive}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm border-2 transition-all ${
                  book?.is_active
                    ? 'bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-400'
                    : 'bg-green-50 border-green-200 text-green-600'
                }`}
              >
                {book?.is_active ? '🔒 Close Book' : '🔓 Reopen Book'}
              </motion.button>

              <Link href={`/book/${book?.slug}`} target="_blank">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                >
                  👁️ Preview
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Total', value: responses.length, emoji: '💌' },
            { label: 'Named', value: responses.filter(r => !r.is_anonymous).length, emoji: '👤' },
            { label: 'Anonymous', value: responses.filter(r => r.is_anonymous).length, emoji: '🎭' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
              <p className="text-2xl mb-1">{stat.emoji}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Filter tabs */}
        {responses.length > 0 && (
          <div className="flex gap-2 mb-8">
            {['all', 'named', 'anonymous'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                  filter === f
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-pink-300'
                }`}
              >
                {f === 'all' ? `All (${responses.length})` : f}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {responses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <p className="text-7xl mb-5">📭</p>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">No responses yet!</h2>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Share your slam book link with friends to start collecting memories.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={copyShareLink}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
            >
              📋 Copy Share Link
            </motion.button>
          </motion.div>
        )}

        {/* Masonry response grid */}
        {filteredResponses.length > 0 && (
          <motion.div
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-6"
          >
            <AnimatePresence>
              {filteredResponses.map((response, index) => (
                <ResponseCard
                  key={response.id}
                  response={response}
                  book={book}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}