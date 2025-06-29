import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CardThemeContextType {
  cardGradient: string;
  setCardGradient: (gradient: string) => void;
}

const CardThemeContext = createContext<CardThemeContextType | undefined>(undefined);

const hexToRgb = (hex: number) => {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return `${r}, ${g}, ${b}`;
};

export function CardThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cardGradient, setCardGradient] = useState<string>('');

  const color1 = user?.card?.color1;
  const color2 = user?.card?.color2;
  const color3 = user?.card?.color3;

  useEffect(() => {
    // We check if colors are defined (not null or undefined). 0 is a valid color value.
    if (color1 !== undefined && color2 !== undefined && color3 !== undefined) {
      console.log('CardThemeContext: Updating gradient with colors:', { color1, color2, color3 });
      const rgb1 = hexToRgb(color1);
      const rgb2 = hexToRgb(color2);
      const rgb3 = hexToRgb(color3);
      const newGradient = `linear-gradient(135deg, rgba(${rgb1}, 0.6), rgba(${rgb2}, 0.6), rgba(${rgb3}, 0.6))`;
      console.log('CardThemeContext: New gradient:', newGradient);
      setCardGradient(newGradient);
    } else {
      console.log('CardThemeContext: No user or card data available, setting default gradient.');
      // Set a default or empty gradient if there's no user
      setCardGradient('linear-gradient(135deg, rgba(20, 20, 20, 0.6), rgba(40, 40, 40, 0.6))');
    }
  }, [color1, color2, color3]);

  return (
    <CardThemeContext.Provider value={{ cardGradient, setCardGradient }}>
      {children}
    </CardThemeContext.Provider>
  );
}

export function useCardTheme() {
  const context = useContext(CardThemeContext);
  if (context === undefined) {
    throw new Error('useCardTheme must be used within a CardThemeProvider');
  }
  return context;
} 