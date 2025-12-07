import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff, Check } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function ApiKeyInput({ apiKey, onApiKeyChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);

  const handleSave = () => {
    onApiKeyChange(localKey);
    // Save to localStorage for persistence
    if (localKey) {
      localStorage.setItem('openai_api_key', localKey);
    } else {
      localStorage.removeItem('openai_api_key');
    }
  };

  const isValid = localKey.startsWith('sk-') && localKey.length > 20;
  const isSaved = apiKey === localKey && isValid;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Key className="w-5 h-5 text-indigo-600" />
        <h3 className="font-medium text-gray-900">Clé API OpenAI</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type={showKey ? 'text' : 'password'}
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-2.5 pr-10 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!isValid || isSaved}
          className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
            isSaved
              ? 'bg-emerald-100 text-emerald-700'
              : isValid
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              Enregistrée
            </>
          ) : (
            'Enregistrer'
          )}
        </motion.button>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Votre clé est stockée localement et n'est jamais envoyée à nos serveurs.
      </p>
    </motion.div>
  );
}
