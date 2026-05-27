import React from 'react';
import { useLocation } from 'react-router-dom';
import TransitionLink from '../common/TransitionLink';
import { useTheme } from '../../contexts/ThemeContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-variant/90 backdrop-blur-lg flex justify-around items-center py-4 z-50">
      <TransitionLink to="/" className={`material-symbols-outlined ${isActive('/') ? 'text-primary' : 'text-on-surface-variant'}`}>
        home
      </TransitionLink>
      <TransitionLink to="/archive" className={`material-symbols-outlined ${isActive('/archive') ? 'text-primary font-bold' : 'text-on-surface-variant'}`} style={isActive('/archive') ? { fontVariationSettings: "'FILL' 1" } : {}}>
        auto_stories
      </TransitionLink>
      <TransitionLink to="/press-room" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
        <span className="material-symbols-outlined">add</span>
      </TransitionLink>
      <button 
        onClick={toggleTheme} 
        className="material-symbols-outlined text-on-surface-variant transition-transform duration-500"
      >
        {theme === 'dark' ? 'dark_mode' : 'light_mode'}
      </button>
      <TransitionLink to="/member" className="material-symbols-outlined text-on-surface-variant">
        person
      </TransitionLink>
    </nav>
  );
};

export default MobileBottomNav;
