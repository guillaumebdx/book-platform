import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Book, BookStatus, Genre } from './types/book';
import type { ToastData } from './components/Toast';
import { Navbar } from './components/Navbar';
import { UploadArea } from './components/UploadArea';
import { BooksToolbar, type ViewMode } from './components/BooksToolbar';
import { BookGrid } from './components/BookGrid';
import { ShelfView } from './components/ShelfView';
import { BookModal } from './components/BookModal';
import { ScanningOverlay } from './components/ScanningOverlay';
import { Toast } from './components/Toast';
import { analyzeBookshelfImage, fileToBase64, loadBookCovers } from './services/openai';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string;

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanningImageUrl, setScanningImageUrl] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookStatus | 'all'>('all');
  const [genreFilter, setGenreFilter] = useState<Genre | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Modal state for shelf view
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Toast state
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Update a single book's cover URL
  const updateBookCover = useCallback((bookId: string, coverUrl: string) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, coverUrl } : book
      )
    );
  }, []);

  const handleAnalyze = useCallback(async (file: File) => {
    if (!API_KEY) {
      addToast('Clé API OpenAI manquante. Ajoutez VITE_OPENAI_API_KEY dans .env', 'info');
      return;
    }

    setIsAnalyzing(true);
    setHasAnalyzed(false);
    setBooks([]);
    
    // Create preview URL for scanning overlay
    const previewUrl = URL.createObjectURL(file);
    setScanningImageUrl(previewUrl);

    try {
      const base64Image = await fileToBase64(file);
      const analyzedBooks = await analyzeBookshelfImage(base64Image, API_KEY);
      
      if (analyzedBooks.length === 0) {
        addToast('Aucun livre n\'a été détecté dans l\'image', 'info');
      } else {
        addToast(`${analyzedBooks.length} livre(s) détecté(s) !`, 'success');
      }
      
      // Display books immediately with placeholders
      setBooks(analyzedBooks);
      setHasAnalyzed(true);
      setIsAnalyzing(false);
      
      // Load covers progressively in background
      loadBookCovers(analyzedBooks, updateBookCover);
    } catch (error) {
      console.error('Analysis error:', error);
      addToast(
        error instanceof Error ? error.message : 'Erreur lors de l\'analyse',
        'info'
      );
      setIsAnalyzing(false);
    }
  }, [addToast, updateBookCover]);

  const handleRequest = useCallback(
    (book: Book) => {
      addToast(`Demande envoyée pour "${book.title}" !`, 'success');
    },
    [addToast]
  );

  const handleNotify = useCallback(
    (book: Book) => {
      addToast(`Vous serez notifié quand "${book.title}" sera disponible.`, 'info');
    },
    [addToast]
  );

  
  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        statusFilter === 'all' || book.status === statusFilter;

      // Genre filter
      const matchesGenre = genreFilter === 'all' || book.genre === genreFilter;

      return matchesSearch && matchesStatus && matchesGenre;
    });
  }, [books, search, statusFilter, genreFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Transformez votre bibliothèque en une{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              collection partageable
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Téléchargez une photo de votre bibliothèque et laissez notre IA identifier vos livres.
            Partagez-les avec vos amis, suivez les prêts et découvrez de nouvelles lectures.
          </p>
        </motion.section>

        {/* Upload Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mb-16"
        >
          <UploadArea onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </motion.section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {isAnalyzing && scanningImageUrl && (
            <motion.section
              key="scanning"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-12"
            >
              <ScanningOverlay imageUrl={scanningImageUrl} />
            </motion.section>
          )}

          {hasAnalyzed && !isAnalyzing && (
            <motion.section
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Votre Bibliothèque
                  <span className="ml-2 text-lg font-normal text-gray-500">
                    ({filteredBooks.length} livres)
                  </span>
                </h2>
              </div>

              <BooksToolbar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                genreFilter={genreFilter}
                onGenreFilterChange={setGenreFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <BookGrid
                      books={filteredBooks}
                      onRequest={handleRequest}
                      onNotify={handleNotify}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="shelf"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ShelfView
                      books={filteredBooks}
                      onBookClick={(book) => setSelectedBook(book)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Toast Container */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Book Modal for Shelf View */}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onRequest={handleRequest}
        onNotify={handleNotify}
      />
    </div>
  );
}

export default App;
