import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCardTheme } from '../contexts/CardThemeContext';
import { useAuth } from '../contexts/AuthContext';
import API from '../api/frontendAPI';
import { toast } from 'sonner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const getSubtitleColor = (grade: string) => {
  switch (grade.toLowerCase()) {
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

const generateRandomGradient = () => {
  const getRandomHexColor = () => {
    // Generates a random integer that represents a hex color
    return Math.floor(Math.random() * 16777215);
  };

  const color1 = getRandomHexColor();
  const color2 = getRandomHexColor();
  const color3 = getRandomHexColor();

  const hexToRgb = (hex: number) => {
    const r = (hex >> 16) & 255;
    const g = (hex >> 8) & 255;
    const b = hex & 255;
    return `${r}, ${g}, ${b}`;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const rgb3 = hexToRgb(color3);

  return {
    gradient: `linear-gradient(135deg, rgba(${rgb1}, 0.6), rgba(${rgb2}, 0.6), rgba(${rgb3}, 0.6))`,
    colors: {
      color1,
      color2,
      color3
    }
  };
};

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { cardGradient, setCardGradient } = useCardTheme();
  const { user, refreshUser } = useAuth();
  const [newCardGradient, setNewCardGradient] = useState<{ gradient: string; colors: { color1: number; color2: number; color3: number; } } | null>(null);
  const [isApplyNewCardEnabled, setIsApplyNewCardEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset states when modal opens
      setNewCardGradient(null);
      setIsApplyNewCardEnabled(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSetRandom = () => {
    setNewCardGradient(generateRandomGradient());
    setIsApplyNewCardEnabled(true);
  };

  const handleSave = async () => {
    if (!newCardGradient) return;

    try {
      setIsLoading(true);
      
      await API.patchUser(
        user.card.grade,
        user.card.sequence,
        newCardGradient.colors.color1,
        newCardGradient.colors.color2,
        newCardGradient.colors.color3
      );
      
      // Refresh user data after successful update
      await refreshUser();
      
      toast.success("Card settings updated successfully.");
      
      onClose();
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyOriginalCard = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-gray-900 rounded-2xl p-6 w-[700px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Card Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-900/50 text-red-400 text-sm rounded text-center">
            {error}
          </div>
        )}

        <div className="flex justify-around items-start space-x-8">
          
          {/* Current Card Section */}
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-white text-lg mt-6">Current Card</h3>
            <div
              className="relative w-[180px] h-[270px] rounded-xl shadow-lg backdrop-blur-sm p-3 flex flex-col justify-between"
              style={{ backgroundImage: cardGradient }}
            >
              <div className="mb-2">
                <span className={`${getSubtitleColor(user.card.grade)} text-xs rounded-xl p-1 px-3 text-white shadow-md`}>{user?.card.grade}</span>
                <div className="font-bold text-base mt-1 text-white pl-2">{user?.id}</div>
              </div>
              <div className="absolute top-1/2 left-9 -translate-x-1/2 -translate-y-1/2">
                <div className="text-5xl text-white text-opacity-50">
                  {user?.card.sequence}
                </div>
              </div>
              <div className="flex justify-between items-end text-white/40 text-xs w-full">
                <div className="flex flex-col">
                  <p>XRPL</p>
                  <p>DApp Radar</p>
                </div>
                <img src="/logo.png" alt="X" className="w-6 h-6" />
              </div>
            </div>
            <button
              onClick={handleApplyOriginalCard}
              className="bg-blue-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors mt-4"
            >
              Apply Original Card
            </button>
            <div className="h-[46px] mt-2"></div>
          </div>
          
          {/* New Card Section */}
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={handleSetRandom}
              className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors mt-4"
            >
              Set Random
            </button>
            <div 
              className="relative w-[180px] h-[270px] rounded-xl shadow-lg p-3 flex flex-col justify-between"
              style={{
                backgroundColor: newCardGradient === null ? '#000000' : undefined,
                backgroundImage: newCardGradient !== null ? newCardGradient.gradient : undefined,
              }}
            >
              {newCardGradient !== null ? (
                <>
                  <div className="mb-2">
                    <span className={`${getSubtitleColor(user.card.grade)} text-xs rounded-xl p-1 px-3 text-white shadow-md`}>{user?.card.grade}</span>
                    <div className="font-bold text-base mt-1 text-white pl-2">{user?.id}</div>
                  </div>
                  <div className="absolute top-1/2 left-9 -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-5xl text-white text-opacity-50">
                      {user?.card.sequence}
                    </div>
                  </div>
                  <div className="flex justify-between items-end text-white/40 text-xs w-full">
                    <div className="flex flex-col">
                      <p>XRPL</p>
                      <p>DApp Radar</p>
                    </div>
                    <img src="/logo.png" alt="X" className="w-6 h-6" />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white text-7xl opacity-50">
                  ?
                </div>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={!isApplyNewCardEnabled || isLoading}
              className={`px-6 py-2 rounded-full font-semibold transition-colors mt-2 ${
                isApplyNewCardEnabled && !isLoading 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Updating...' : 'Apply New Card'}
            </button>
            <div className="h-[46px] mt-2"></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}; 