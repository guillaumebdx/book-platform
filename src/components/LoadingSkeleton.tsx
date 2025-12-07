import { motion } from 'framer-motion';

export function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center gap-3 text-indigo-600"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full"
          />
          <span className="text-lg font-medium">Analyse de vos livres en cours...</span>
        </motion.div>
        <p className="text-gray-500 text-sm mt-2">
          Notre IA identifie les titres, auteurs et génère des résumés
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden"
          >
            <div className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded-lg animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded-lg animate-pulse w-1/2" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
