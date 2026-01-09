import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FaLock } from 'react-icons/fa';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser, isCommunityMember, logout } = useAuth();
  return (
    <header className="font-mono text-white py-8 px-4 sm:px-8 relative">
      <div className="flex flex-col items-center relative">
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-800 text-white">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {(currentUser || isCommunityMember) && (
            <button onClick={logout} className="p-2 rounded-full bg-gray-800 text-white">
              Logout
            </button>
          )}
        </div>
      <div className="mb-8">
        <img src="/logo.png" alt="Sparktizen Logo" className="h-12 mx-auto" />
      </div>
      {!currentUser && !isCommunityMember && (
        <a href="#" className="border-b border-white pb-1 flex items-center space-x-2 text-sm sm:text-base">
          <FaLock />
          <span>ENTER USING PASSWORD</span>
        </a>
      )}
      </div>
    </header>
  );
};

export default Header;
