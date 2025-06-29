import React, { useState } from 'react';

const FirstLedgerIcon = () => (
    <div className="w-6 h-6 bg-black border border-gray-600 flex items-center justify-center rounded-md">
       <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 17 16" stroke="currentColor" strokeWidth="2">
        <path d="M1.57031 14.9399L8.2846 1.06006M8.2846 1.06006L15.4285 14.9399M8.2846 1.06006H1.57031H15.4285" strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
    </div>
);

const XIcon = () => (
    <svg fill="currentColor" className="w-2 h-2 text-white" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
);

export const mockNotices = [
  {
    serviceName: 'First_Ledger',
    icon: <FirstLedgerIcon />,
    handle: '@First_Ledger',
    text: 'Easiest way to create and trade on the XRPL☕',
    link: 'https://x.com/First_Ledger'
  },
  {
    serviceName: 'Sologenic',
    icon: <img src="https://avatars.githubusercontent.com/u/56408308?s=200&v=4" alt="Sologenic" className="w-6 h-6 rounded-full" />,
    handle: '@realSologenic',
    text: 'Issue, trade, and manage your digital assets on a decentralized platform',
    link: 'https://x.com/realSologenic'
  },
  {
    serviceName: 'Magnetic',
    icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWD3jBRobLBZbefTa6RvbEVi1cqPRjIWvAZw&s" alt="Magnetic" className="w-6 h-6 rounded-full" />,
    handle: '@MagneticXRPL',
    text: '#1 DEX on #XRPL | AMM | Farming | $MAG #1 tap on XRPL',
    link: 'https://x.com/MagneticXRPL'
  },
  {
    serviceName: 'OpulenceX',
    icon: <img src="https://pbs.twimg.com/profile_images/1907882095344758786/bkdzef2B_400x400.jpg" alt="OpulenceX" className="w-6 h-6 rounded-full" />,
    handle: '@_OpulenceX',
    text: 'NFT trading with enhanced features & RWA integration into blockchain',
    link: 'https://x.com/_OpulenceX'
  }
];

export const NoticeNow = () => {

  return (
    <div className="mt-6 select-none">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">X Address</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockNotices.map((notice, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-4 flex flex-col justify-between min-h-[170px]">
            <div className="flex-grow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {notice.icon}
                  <span className="font-bold text-white">{notice.serviceName}</span>
                </div>
              </div>
              <a href={notice.link} target="_blank" rel="noopener noreferrer" className="inline-block text-xs bg-blue-900/50 text-blue-400 px-2 py-1 rounded-md mb-3">
                {notice.handle}
              </a>
              <p className="text-sm text-gray-300 leading-snug">
                {notice.text}
              </p>
            </div>
            <a href={notice.link} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-white flex items-center space-x-1.5 mt-3">
              <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center">
                <XIcon />
              </div>
              <span>Click to view on X</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}; 