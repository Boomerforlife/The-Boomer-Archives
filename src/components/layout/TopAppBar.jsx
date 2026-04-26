import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TransitionLink from '../common/TransitionLink';

const TopAppBar = ({ visible = true }) => {
  const location = useLocation();
  const [hoveredWord, setHoveredWord] = useState('Boomer');
  const [isHovering, setIsHovering] = useState(false);
  const names = ['Boomer', ' Vighnesh ', 'Yash', 'Trigger'];
  
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (!isHovering) {
      setHoveredWord('Boomer');
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % names.length;
      setHoveredWord(names[currentIndex]);
    }, 600);

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <header className={`fixed top-0 w-full z-50 glass-header transition-transform duration-500 ease-in-out ${
      visible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <TransitionLink to="/" className="text-2xl font-serif font-bold text-on-surface tracking-tighter">
          <span className="inline">The </span>
          <span 
            className="inline-block cursor-pointer transition-all duration-300 ease-in-out min-w-[100px] text-center"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
              transform: isHovering ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            <span 
              key={hoveredWord}
              className="inline-block animate-fade-in"
              style={{
                animation: 'fadeIn 0.5s ease-in-out',
              }}
            >
              {hoveredWord}
            </span>
          </span>
          <span className="inline"> Archives</span>
        </TransitionLink>
        
        <nav className="hidden md:flex items-center gap-8">
          <TransitionLink 
            to="/archive" 
            className={`relative text-sm font-sans transition-all duration-300 group ${
              isActive('/archive') 
                ? 'text-on-surface' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Archive
            <span className={`absolute bottom-0 left-0 h-[1px] bg-primary transition-all duration-300 ${
              isActive('/archive') ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </TransitionLink>
          <TransitionLink 
            to="/member" 
            className={`relative text-sm font-sans transition-all duration-300 group ${
              isActive('/member') 
                ? 'text-on-surface' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Library
            <span className={`absolute bottom-0 left-0 h-[1px] bg-primary transition-all duration-300 ${
              isActive('/member') ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </TransitionLink>
          <TransitionLink 
            to="/press-room" 
            className={`relative text-sm font-sans transition-all duration-300 group ${
              isActive('/press-room') 
                ? 'text-on-surface' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Press Room
            <span className={`absolute bottom-0 left-0 h-[1px] bg-primary transition-all duration-300 ${
              isActive('/press-room') ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </TransitionLink>
        </nav>
        
        <div></div>
      </div>
    </header>
  );
};

export default TopAppBar;
