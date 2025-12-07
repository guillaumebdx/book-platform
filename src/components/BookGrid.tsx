import { motion } from 'framer-motion';
import type { Book } from '../types/book';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onRequest: (book: Book) => void;
  onNotify: (book: Book) => void;
}

export function BookGrid({ books, onRequest, onNotify }: BookGridProps) {
  if (books.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <p className="text-gray-500 text-lg">Aucun livre ne correspond à vos filtres.</p>
        <p className="text-gray-400 text-sm mt-1">Essayez d'ajuster votre recherche ou vos filtres.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book, index) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <BookCard
            book={book}
            onRequest={onRequest}
            onNotify={onNotify}
          />
        </motion.div>
      ))}
    </div>
  );
}
