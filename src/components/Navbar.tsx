import { BookOpen } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Passe-Livre</h1>
              <p className="text-xs text-gray-500 -mt-0.5">Partagez votre bibliothèque</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
