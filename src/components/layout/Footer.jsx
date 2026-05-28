import React from 'react';
import TransitionLink from '../common/TransitionLink';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <footer className="bg-surface-dim w-full pt-12 pb-32 md:pb-12 border-t border-outline-variant/10 mt-20">
      <div className="flex flex-col items-center gap-4 w-full text-center">
        <div className="flex gap-8">
          <TransitionLink to="/legal" className="text-xs font-sans tracking-wide text-on-surface-variant hover:text-on-surface transition-colors">
            Privacy
          </TransitionLink>
          <TransitionLink to="/legal" className="text-xs font-sans tracking-wide text-on-surface-variant hover:text-on-surface transition-colors">
            Terms
          </TransitionLink>
          <TransitionLink to="/colophon" className="text-xs font-sans tracking-wide text-on-surface-variant hover:text-on-surface transition-colors underline decoration-1 underline-offset-4">
            Colophon
          </TransitionLink>
        </div>
        <p className="text-xs font-sans tracking-wide text-on-surface-variant">
          © 2024 The Boomer Archives
        </p>
        <div className="mt-4 flex gap-4 items-center">
          <span className="material-symbols-outlined text-primary cursor-pointer hover:text-on-surface transition-colors">share</span>
          <TransitionLink to="/subscribe" className="flex items-center">
            <span className="material-symbols-outlined text-primary cursor-pointer hover:text-on-surface transition-colors">mail</span>
          </TransitionLink>
          
          <div className="w-px h-4 bg-outline-variant/30 mx-2"></div>
          
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant transition-colors border border-outline-variant/30"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className={`material-symbols-outlined text-primary text-[18px] transition-transform duration-500 ${theme === 'dark' ? 'rotate-180' : 'rotate-0'}`}>
              {theme === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
