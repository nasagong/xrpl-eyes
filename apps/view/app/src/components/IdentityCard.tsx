import { useState } from 'react';
import { IdentityDetailModal } from './IdentityDetailModal';
import { useCardTheme } from '../contexts/CardThemeContext';
import { useAuth } from '../contexts/AuthContext';

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

export const IdentityCard = () => {
  const [showModal, setShowModal] = useState(false);
  const { cardGradient } = useCardTheme();
  const { isAuthenticated, user } = useAuth();

  console.log('IdentityCard: user data:', user);
  console.log('IdentityCard: cardGradient:', cardGradient);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <div 
        className="relative h-full cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div
          className="h-[450px] w-[300px] rounded-2xl p-4 pt-6 select-none backdrop-blur-sm"
          style={{ 
            backgroundImage: cardGradient,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="mb-4">
            <span className={`${getSubtitleColor(user.card.grade)} text-xs rounded-xl p-1 px-3 text-white shadow-md`}>
              {user.card.grade.toUpperCase()}
            </span>
            <div className="font-bold text-lg mt-2 text-white pl-3">{user.id}</div>
          </div>
          
          <div className="absolute top-36 left-3 text-center mt-8">
            <div className="text-7xl text-white mb-4 text-opacity-50">  
              {user.card.sequence}
            </div>
          </div>

          <div className="absolute bottom-4 px-4 right-2 w-full text-3xl text-white text-opacity-40">
            <p>XRPL</p>
            <p>Eyes</p>
          </div>
          <div className="absolute bottom-4 right-4">
            <img src="/logo.png" alt="X" className="w-8 h-8" />
          </div>
        </div>
      </div>

      {showModal && (
        <IdentityDetailModal
          value={user.card.sequence.toString()}
          subtitle={user.card.grade.toUpperCase()}
          address={user.id}
          onClose={() => setShowModal(false)}
          isOpen={showModal}
        />
      )}
    </>
  );
};
