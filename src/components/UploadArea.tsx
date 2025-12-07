import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, X, Sparkles } from 'lucide-react';
import clsx from 'clsx';

interface UploadAreaProps {
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
}

export function UploadArea({ onAnalyze, isAnalyzing }: UploadAreaProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image (JPEG ou PNG)');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleAnalyzeClick = () => {
    if (!file) {
      setError('Veuillez d\'abord sélectionner une image de votre bibliothèque');
      return;
    }
    onAnalyze(file);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={clsx(
          'relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer',
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50'
            : file
            ? 'border-gray-200 bg-white/50'
            : 'border-gray-300 bg-white/30 hover:border-indigo-400 hover:bg-white/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {file && preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl shadow-md"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm text-indigo-600 mt-1">
                  Cliquez pour changer l'image
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                {isDragging ? (
                  <Upload className="w-8 h-8 text-indigo-600" />
                ) : (
                  <Image className="w-8 h-8 text-indigo-600" />
                )}
              </div>
              <p className="text-gray-700 font-medium">
                {isDragging ? 'Déposez votre image ici' : 'Téléchargez une photo de votre bibliothèque'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Glissez-déposez ou cliquez pour parcourir
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Formats acceptés : JPEG et PNG
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAnalyzeClick}
        disabled={isAnalyzing}
        className={clsx(
          'w-full py-3 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2',
          isAnalyzing
            ? 'bg-indigo-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
        )}
      >
        {isAnalyzing ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            Analyse en cours...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Analyser ma bibliothèque
          </>
        )}
      </motion.button>
    </div>
  );
}
