import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const XIcon = () => (
    <svg fill="currentColor" className="w-3 h-3 text-white" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
    </svg>
);

interface Notice {
    serviceName: string;
    icon: React.ReactNode;
    handle: string;
    text: string;
    time: string;
    link: string;
}

interface NoticeListModalProps {
  notices: Notice[];
  onClose: () => void;
  isOpen: boolean;
}

export const NoticeListModal = ({ notices, onClose, isOpen }: NoticeListModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-2xl mx-4 max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white pointer-default">All Notices</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(80vh-73px)]">
            {notices.map((notice, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                      {notice.icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-white font-bold">{notice.serviceName}</span>
                                <a href={notice.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{notice.handle}</a>
                            </div>
                            <span className="text-gray-500 text-xs">{notice.time}</span>
                        </div>
                        <p className="text-gray-300 mt-2">{notice.text}</p>
                        <a href={notice.link} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-white flex items-center space-x-1.5 mt-3">
                            <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center">
                                <XIcon />
                            </div>
                            <span>View on X</span>
                        </a>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 