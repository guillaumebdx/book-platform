import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bell, RotateCcw } from 'lucide-react';
import type { Book } from '../types/book';
import { StatusBadge } from './StatusBadge';

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  onRequest: (book: Book) => void;
  onNotify: (book: Book) => void;
}

export function BookModal({ book, onClose, onRequest, onNotify }: BookModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when book changes
  if (!book) {
    return null;
  }

  return (
    <AnimatePresence>
      {book && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Card container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm h-[500px]"
            style={{ perspective: '1000px' }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full h-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card */}
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="h-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                  {/* Cover image */}
                  <div className="relative flex-1 overflow-hidden">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <span className="inline-block px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-medium text-gray-700">
                        {book.genre}
                      </span>
                      <StatusBadge status={book.status} />
                    </div>
                  </div>

                  {/* Card info */}
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                    
                    {/* Flip button */}
                    <button
                      onClick={() => setIsFlipped(true)}
                      className="mt-3 w-full py-2.5 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Voir le résumé
                    </button>
                  </div>
                </div>
              </div>

              {/* Back of card */}
              <div
                className="absolute inset-0"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="h-full bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col">
                  <div className="flex-1 overflow-auto">
                    <h3 className="font-bold text-white text-xl leading-tight mb-1">
                      {book.title}
                    </h3>
                    <p className="text-indigo-200 text-sm mb-4">{book.author}</p>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-white/90 text-sm leading-relaxed">
                        {book.summary}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {book.status === 'available' ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onRequest(book)}
                        className="w-full py-3 bg-white text-indigo-600 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Demander ce livre
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNotify(book)}
                        className="w-full py-3 bg-amber-400 text-amber-900 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors"
                      >
                        <Bell className="w-4 h-4" />
                        Me notifier
                      </motion.button>
                    )}
                    
                    <button
                      onClick={() => setIsFlipped(false)}
                      className="w-full py-2 text-white/80 hover:text-white text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Retourner
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
