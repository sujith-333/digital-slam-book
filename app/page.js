// app/page.js — The Landing Page

import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 text-center py-8 px-6">
        <p className="text-2xl mb-3">📖</p>
        <p className="font-display text-white text-lg mb-1">SlamBook</p>
        <p className="text-sm">Made with 💜 — Collect memories, cherish friendships</p>
      </footer>
    </main>
  );
}