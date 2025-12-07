import { motion } from 'framer-motion';
import type { Book } from '../types/book';
import { StatusBadge } from './StatusBadge';

interface ShelfViewProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export function ShelfView({ books, onBookClick }: ShelfViewProps) {
  // Split books into shelves (5-7 books per shelf)
  const shelves: Book[][] = [];
  const booksPerShelf = 6;
  
  for (let i = 0; i < books.length; i += booksPerShelf) {
    shelves.push(books.slice(i, i + booksPerShelf));
  }

  return (
    <div className="space-y-2">
      {shelves.map((shelfBooks, shelfIndex) => (
        <motion.div
          key={shelfIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shelfIndex * 0.1 }}
          className="relative"
        >
          {/* Shelf with books */}
          <div className="relative bg-gradient-to-b from-amber-800 to-amber-900 rounded-t-sm px-4 pt-4 pb-1">
            {/* Books on shelf */}
            <div className="flex items-end justify-center gap-1 min-h-[200px]">
              {shelfBooks.map((book, bookIndex) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shelfIndex * 0.1 + bookIndex * 0.05 }}
                  whileHover={{ 
                    y: -10, 
                    rotateZ: -2,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => onBookClick(book)}
                  className="relative cursor-pointer group"
                  style={{
                    // Vary book heights slightly
                    height: `${160 + (book.title.length % 3) * 15}px`,
                  }}
                >
                  {/* Book spine */}
                  <div 
                    className="relative h-full w-12 sm:w-14 rounded-sm overflow-hidden shadow-lg transform-gpu"
                    style={{
                      background: `linear-gradient(135deg, 
                        ${getBookColor(book.title)} 0%, 
                        ${getBookColorDark(book.title)} 100%)`,
                    }}
                  >
                    {/* Book cover image (if available, shown as small thumbnail) */}
                    {!book.coverUrl.includes('placehold.co') && (
                      <div className="absolute inset-0 opacity-30">
                        <img 
                          src={book.coverUrl} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Spine text */}
                    <div className="absolute inset-0 flex items-center justify-center p-1">
                      <span 
                        className="text-white text-[10px] font-medium writing-vertical transform rotate-180 text-center leading-tight drop-shadow-md"
                        style={{ 
                          writingMode: 'vertical-rl',
                          textOrientation: 'mixed',
                          maxHeight: '90%',
                          overflow: 'hidden',
                        }}
                      >
                        {book.title.length > 25 ? book.title.slice(0, 22) + '...' : book.title}
                      </span>
                    </div>
                    
                    {/* Spine highlight */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
                    <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-black/20" />
                    
                    {/* Status indicator */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                      <div className={`w-2 h-2 rounded-full ${
                        book.status === 'available' 
                          ? 'bg-emerald-400 shadow-emerald-400/50' 
                          : 'bg-amber-400 shadow-amber-400/50'
                      } shadow-lg`} />
                    </div>
                  </div>
                  
                  {/* Hover tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                      <p className="font-semibold">{book.title}</p>
                      <p className="text-gray-400">{book.author}</p>
                      <div className="mt-1">
                        <StatusBadge status={book.status} />
                      </div>
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Shelf board */}
          <div className="h-4 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-b-md shadow-lg">
            <div className="h-1 bg-amber-600/50 rounded-t-sm" />
          </div>
          
          {/* Shelf shadow */}
          <div className="h-2 bg-gradient-to-b from-black/20 to-transparent mx-2" />
        </motion.div>
      ))}
      
      {/* Empty state */}
      {books.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Aucun livre sur l'étagère.</p>
        </div>
      )}
    </div>
  );
}

// Generate consistent colors based on book title
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const BOOK_COLORS = [
  { light: '#6366f1', dark: '#4338ca' }, // Indigo
  { light: '#8b5cf6', dark: '#6d28d9' }, // Violet
  { light: '#ec4899', dark: '#be185d' }, // Pink
  { light: '#f59e0b', dark: '#b45309' }, // Amber
  { light: '#10b981', dark: '#047857' }, // Emerald
  { light: '#3b82f6', dark: '#1d4ed8' }, // Blue
  { light: '#ef4444', dark: '#b91c1c' }, // Red
  { light: '#14b8a6', dark: '#0f766e' }, // Teal
  { light: '#f97316', dark: '#c2410c' }, // Orange
  { light: '#84cc16', dark: '#4d7c0f' }, // Lime
];

function getBookColor(title: string): string {
  const index = hashString(title) % BOOK_COLORS.length;
  return BOOK_COLORS[index].light;
}

function getBookColorDark(title: string): string {
  const index = hashString(title) % BOOK_COLORS.length;
  return BOOK_COLORS[index].dark;
}
