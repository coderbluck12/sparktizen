import React from 'react';
import { FaWhatsapp, FaLock } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="text-black py-3 px-4 sm:px-6 lg:px-8 fixed bottom-0 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sm">
          <FaLock />
        </div>
        <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
          <FaWhatsapp className="text-green-500 text-4xl" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
