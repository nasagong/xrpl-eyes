import { useState } from 'react';
import { Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCardTheme } from '../contexts/CardThemeContext';
import { SettingsModal } from './SettingsModal';
import { AnimatePresence, motion } from 'framer-motion';

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const getRandomHexColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
};

export const Header = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { cardGradient } = useCardTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-black select-none sticky top-0 z-40 pb-4">
      <div className="container mx-auto px-4 py-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8">
              <span><img src="/logo.png" alt="logo" className="w-full h-full"></img></span>
            </div>
            <button className="text-xl text-white font-bold bg-clip-text text-transparent">
              XRPL Eyes
            </button>
          </div>

          <div className="flex items-center space-x-8">
            {user ? (
              <div
                onClick={() => setIsSettingsOpen(true)}
                className="relative cursor-pointer transition-all duration-300"
              >
                {/* Identity Card Style */}
                <div
                  className="flex items-center justify-center h-16 w-12 rounded-lg p-3 select-none backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:brightness-110"
                  title="카드 색 변경"
                  style={{ 
                    backgroundImage: cardGradient,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <Settings className="w-5 h-5 text-white" />
                  {/* Glow effect */}
                  <div
                    className="absolute flex item-center justify-center inset-0 rounded-xl transition-all border border-2 duration-300 hover:shadow-lg"
                    style={{
                      boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
                    }}
                  />
                </div>
              </div>
            ) : <></>
          }
            {user ? (
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300 text-sm font-medium"
              >
                Logout
              </button>
            ) : <></>
            }
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </AnimatePresence>
    </header>
  );
};
