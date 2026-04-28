// components/ui/Button.jsx
// Reusable button with multiple variants

'use client';

import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  variant = 'primary',  // 'primary' | 'secondary' | 'retro' | 'ghost'
  size = 'md',          // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-pink-200 hover:-translate-y-0.5',
    secondary: 'bg-white text-gray-800 border-2 border-gray-200 hover:border-pink-300 hover:text-pink-500 hover:-translate-y-0.5',
    retro: 'bg-pink-400 text-white border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px]',
    ghost: 'text-gray-600 hover:text-pink-500 hover:bg-pink-50',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : children}
    </motion.button>
  );
}