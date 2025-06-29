import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCardTheme } from '../contexts/CardThemeContext';

interface IdentityDetailModalProps {
  value: string;
  subtitle: string;
  address: string;
  onClose: () => void;
  isOpen: boolean;
}

const getSubtitleColor = (subtitle: string) => {
  switch (subtitle.toLowerCase()) {
    case 'bronze':
      return 'bg-amber-700/50';
    case 'silver':
      return 'bg-gray-400/50';
    case 'gold':
      return 'bg-yellow-500/50';
    default:
      return 'bg-gray-500/50';
  }
};

export const IdentityDetailModal = ({ value, subtitle, address, onClose, isOpen }: IdentityDetailModalProps) => {
  if (!isOpen) return null;

  const { cardGradient } = useCardTheme();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative h-[675px] w-[450px]"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl backdrop-blur-sm shadow-2xl"
            style={{
              backgroundImage: cardGradient,
            }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 rounded-2xl" />
            
            {/* Card content */}
            <div className="relative h-full flex flex-col">
              <div className="p-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className={`${getSubtitleColor(subtitle)} text-sm rounded-xl p-1.5 px-4 text-white shadow-md`}>{subtitle}</span>
                    <h2 className="text-2xl font-bold text-white mt-2 drop-shadow-lg pl-3">{address}</h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 pl-3 space-y-8 flex-1">
                <motion.div 
                  className="pt-24"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-9xl text-white mb-4 text-opacity-50 drop-shadow-lg">
                    {value}
                  </div>
                </motion.div>

                <motion.div 
                  className="absolute bottom-0 left-0 p-6 w-full justify-between items-center text-white/40 text-base mt-auto"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-between items-center">
                  <p className="text-4xl">XRPL<br /> Eyes</p>
                  <img src="/logo.png" alt="X" className="w-14 h-14" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 