import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useUI } from '../../lib/uiStore';
import { cn } from '../../lib/utils';

export function ToastContainer() {
  const { toasts, dismiss } = useUI();
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => {
          const styles = {
            success: { bg: 'bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" /> },
            error: { bg: 'bg-red-500/10 border-red-500/20', icon: <AlertCircle className="h-4 w-4 text-red-500" /> },
            warning: { bg: 'bg-amber-500/10 border-amber-500/20', icon: <AlertTriangle className="h-4 w-4 text-amber-500" /> },
            info: { bg: 'bg-blue-500/10 border-blue-500/20', icon: <Info className="h-4 w-4 text-blue-500" /> },
          };
          const s = styles[t.variant || 'info'];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100 }}
              className={cn('flex items-start gap-3 p-3 pr-2 rounded-xl border bg-[var(--surface)] shadow-[var(--shadow-pop)]', s.bg)}
            >
              <div className="flex-shrink-0 mt-0.5">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text)]">{t.title}</p>
                {t.description && <p className="text-xs text-[var(--text-muted)] mt-0.5">{t.description}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} className="p-1 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
