import { Search, LayoutGrid, Library } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BookStatus, Genre } from '../types/book';
import clsx from 'clsx';

export type ViewMode = 'grid' | 'shelf';

const GENRES: { value: Genre; label: string }[] = [
  { value: 'Fiction', label: 'Fiction' },
  { value: 'Tech', label: 'Technologie' },
  { value: 'Essay', label: 'Essai' },
  { value: 'Science', label: 'Science' },
  { value: 'Biography', label: 'Biographie' },
  { value: 'Self-Help', label: 'Développement personnel' },
];

interface BooksToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: BookStatus | 'all';
  onStatusFilterChange: (value: BookStatus | 'all') => void;
  genreFilter: Genre | 'all';
  onGenreFilterChange: (value: Genre | 'all') => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function BooksToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  genreFilter,
  onGenreFilterChange,
  viewMode,
  onViewModeChange,
}: BooksToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre ou auteur..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value as BookStatus | 'all')}
          className="px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
        >
          <option value="all">Tous les statuts</option>
          <option value="available">Disponible</option>
          <option value="lent">Prêté</option>
        </select>

        {/* View Mode Toggle */}
        <div className="flex bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewModeChange('grid')}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              viewMode === 'grid'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grille</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewModeChange('shelf')}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              viewMode === 'shelf'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <Library className="w-4 h-4" />
            <span className="hidden sm:inline">Étagère</span>
          </motion.button>
        </div>
      </div>

      {/* Genre Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onGenreFilterChange('all')}
          className={clsx(
            'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
            genreFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white/70 text-gray-600 hover:bg-white border border-gray-200'
          )}
        >
          Tous les genres
        </button>
        {GENRES.map((genre) => (
          <button
            key={genre.value}
            onClick={() => onGenreFilterChange(genre.value)}
            className={clsx(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
              genreFilter === genre.value
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white/70 text-gray-600 hover:bg-white border border-gray-200'
            )}
          >
            {genre.label}
          </button>
        ))}
      </div>
    </div>
  );
}
