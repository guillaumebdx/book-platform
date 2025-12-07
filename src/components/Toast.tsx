import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Bell } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'info';
}

interface ToastProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

export function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="flex items-center gap-3 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl px-4 py-3 shadow-lg min-w-[280px]"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <Bell className="w-5 h-5 text-amber-500 shrink-0" />
            )}
            <span className="text-sm text-gray-700 flex-1">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
