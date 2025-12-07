import { motion } from 'framer-motion';
import { Scan } from 'lucide-react';

interface ScanningOverlayProps {
  imageUrl: string;
}

export function ScanningOverlay({ imageUrl }: ScanningOverlayProps) {
  return (
    <div className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
      {/* The uploaded image */}
      <img
        src={imageUrl}
        alt="Bibliothèque en cours d'analyse"
        className="w-full h-auto"
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Scanning line effect - left to right */}
      <motion.div
        initial={{ left: '-10%' }}
        animate={{ left: '110%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-0 bottom-0 w-1 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8), transparent)',
          boxShadow: '0 0 30px 10px rgba(99, 102, 241, 0.5), 0 0 60px 20px rgba(168, 85, 247, 0.3)',
          width: '4px',
        }}
      />
      
      {/* Scan grid overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      
      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-indigo-400" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-indigo-400" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-indigo-400" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-indigo-400" />
      
      {/* Status text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Scan className="w-6 h-6 text-indigo-400" />
          </motion.div>
          <div>
            <p className="text-white font-semibold">Analyse en cours...</p>
            <p className="text-indigo-300 text-sm">Identification des livres</p>
          </div>
        </motion.div>
        
        {/* Detected books counter animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex gap-2"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-indigo-400 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
