export const themes = {
  retro: {
    id: 'retro', name: 'Retro 90s', emoji: '📼',
    bg: 'bg-yellow-50',
    card: 'bg-white border-4 border-black shadow-[6px_6px_0px_#000]',
    primary: 'bg-pink-500 text-white',
    text: 'text-gray-900', font: 'font-mono',
    accent: '#FF2D78', gradient: 'from-yellow-300 via-pink-300 to-cyan-300',
  },
  minimal: {
    id: 'minimal', name: 'Minimal', emoji: '🤍',
    bg: 'bg-gray-50',
    card: 'bg-white border border-gray-200 shadow-sm',
    primary: 'bg-gray-900 text-white',
    text: 'text-gray-800', font: 'font-sans',
    accent: '#111827', gradient: 'from-gray-100 via-white to-gray-100',
  },
  neon: {
    id: 'neon', name: 'Neon Night', emoji: '🌃',
    bg: 'bg-gray-950',
    card: 'bg-gray-900 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    primary: 'bg-purple-500 text-white',
    text: 'text-white', font: 'font-mono',
    accent: '#A855F7', gradient: 'from-purple-900 via-blue-900 to-cyan-900',
  },
  pastel: {
    id: 'pastel', name: 'Pastel Dream', emoji: '🌸',
    bg: 'bg-pink-50',
    card: 'bg-white border border-pink-100 shadow-lg shadow-pink-100/50',
    primary: 'bg-gradient-to-r from-pink-400 to-purple-400 text-white',
    text: 'text-gray-700', font: 'font-sans',
    accent: '#EC4899', gradient: 'from-pink-200 via-purple-100 to-blue-200',
  },
};

export const defaultQuestions = [
  { id: 'q1', text: "What's your first memory of me? 🌟", type: 'text', required: true, order: 0 },
  { id: 'q2', text: 'Rate my vibe on a scale of 1-5 ✨', type: 'emoji-rating', required: true, order: 1 },
  { id: 'q3', text: 'If I were a movie, what genre would I be? 🎬', type: 'multiple-choice',
    options: ['Rom-Com 💕', 'Action 💥', 'Horror 👻', 'Documentary 🎥', 'Animated 🌈'],
    required: false, order: 2 },
  { id: 'q4', text: 'What color represents our friendship? 🎨', type: 'color-picker', required: false, order: 3 },
  { id: 'q5', text: 'Leave me a secret message! 🤫', type: 'text', required: false, order: 4 },
];