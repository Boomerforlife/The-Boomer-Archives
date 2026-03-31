import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TopAppBar = ({ visible = true }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 w-full z-50 glass-header transition-transform duration-500 ease-in-out ${
      visible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-serif font-bold text-on-surface tracking-tighter">
          The Boomer Archives
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/archive" 
            className={`text-sm font-sans transition-colors duration-300 ${
              isActive('/archive') 
                ? 'text-on-surface border-b border-primary pb-1' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Archive
          </Link>
          <Link 
            to="/member" 
            className={`text-sm font-sans transition-colors duration-300 ${
              isActive('/member') 
                ? 'text-on-surface border-b border-primary pb-1' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Library
          </Link>
          <Link 
            to="/press-room" 
            className={`text-sm font-sans transition-colors duration-300 ${
              isActive('/press-room') 
                ? 'text-on-surface border-b border-primary pb-1' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Press Room
          </Link>
        </nav>
        
        <div></div>
      </div>
    </header>
  );
};

export default TopAppBar;
