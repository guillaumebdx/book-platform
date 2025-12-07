import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bell, Sparkles, RotateCcw } from 'lucide-react';
import type { Book } from '../types/book';
import { StatusBadge } from './StatusBadge';

interface BookCardProps {
  book: Book;
  onRequest: (book: Book) => void;
  onNotify: (book: Book) => void;
}

export function BookCard({ book, onRequest, onNotify }: BookCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const prevCoverRef = useRef(book.coverUrl);
  const isPlaceholder = book.coverUrl.includes('placehold.co');

  // Detect when cover changes from placeholder to real cover
  useEffect(() => {
    if (prevCoverRef.current !== book.coverUrl && !isPlaceholder) {
      setCoverLoaded(true);
      setShowSparkle(true);
      const timer = setTimeout(() => setShowSparkle(false), 1500);
      return () => clearTimeout(timer);
    }
    prevCoverRef.current = book.coverUrl;
  }, [book.coverUrl, isPlaceholder]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative h-[420px]"
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
          <div className="h-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
            {/* Cover image */}
            <div className="relative overflow-hidden flex-1">
              <AnimatePresence mode="wait">
                <motion.img
                  key={book.coverUrl}
                  src={book.coverUrl}
                  alt={book.title}
                  initial={coverLoaded ? { opacity: 0, scale: 1.2 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Sparkle effect */}
              <AnimatePresence>
                {showSparkle && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.1, 1.2] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-pink-500/30 pointer-events-none"
                    />
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0, x: '50%', y: '50%' }}
                        animate={{ 
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0.5],
                          x: `${20 + Math.random() * 60}%`,
                          y: `${20 + Math.random() * 60}%`,
                        }}
                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                        className="absolute pointer-events-none"
                      >
                        <Sparkles className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.2, 1.5] }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-0 border-4 border-indigo-400 rounded-2xl pointer-events-none"
                    />
                  </>
                )}
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <span className="inline-block px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-medium text-gray-700">
                  {book.genre}
                </span>
                <StatusBadge status={book.status} />
              </div>
            </div>

            {/* Card info */}
            <div className="p-3 bg-white">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
                {book.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{book.author}</p>
              
              {/* Flip button - more visible */}
              <button
                onClick={() => setIsFlipped(true)}
                className="mt-2 w-full py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Voir le résumé
              </button>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="h-full bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl overflow-hidden shadow-lg p-5 flex flex-col">
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg leading-tight mb-1">
                {book.title}
              </h3>
              <p className="text-indigo-200 text-sm mb-4">{book.author}</p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
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
                  className="w-full py-2.5 bg-white text-indigo-600 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Demander ce livre
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNotify(book)}
                  className="w-full py-2.5 bg-amber-400 text-amber-900 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors"
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
  );
}
