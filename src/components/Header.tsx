import React from 'react';
import { FaLock } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="font-mono text-white py-8 px-4 sm:px-8 relative">
      <div className="flex flex-col items-center">
      <div className="mb-8">
        <img src="/logo.png" alt="Sparktizen Logo" className="h-12 mx-auto" />
      </div>
      <a href="#" className="border-b border-white pb-1 flex items-center space-x-2 text-sm sm:text-base">
        <FaLock />
        <span>ENTER USING PASSWORD</span>
      </a>
      </div>
    </header>
  );
};

export default Header;
