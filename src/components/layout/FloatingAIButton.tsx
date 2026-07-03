import { Sparkles } from 'lucide-react';
import { useUI } from '../../lib/uiStore';
import { motion } from 'framer-motion';

export function FloatingAIButton() {
  const { aiOpen, setAiOpen } = useUI();
  if (aiOpen) return null;
  return (
    <motion.button
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setAiOpen(true)}
      className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/40 group"
    >
      <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[var(--bg)] pulse-soft" />
    </motion.button>
  );
}
