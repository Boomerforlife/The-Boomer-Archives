import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface-dim w-full py-12 border-t border-outline-variant/10 mt-20">
      <div className="flex flex-col items-center gap-4 w-full text-center">
        <div className="flex gap-8">
          <Link to="/" className="text-xs font-sans tracking-wide text-on-surface-variant hover:text-on-surface transition-colors">
            Privacy
          </Link>
          <Link to="/" className="text-xs font-sans tracking-wide text-on-surface-variant hover:text-on-surface transition-colors">
            Terms
          </Link>
          <Link to="/" className="text-xs font-sans tracking-wide text-on-surface-variant hover:text-on-surface transition-colors underline decoration-1 underline-offset-4">
            Colophon
          </Link>
        </div>
        <p className="text-xs font-sans tracking-wide text-on-surface-variant">
          © 2024 The Boomer Archives
        </p>
        <div className="mt-4 flex gap-4">
          <span className="material-symbols-outlined text-primary cursor-pointer hover:text-on-surface transition-colors">share</span>
          <span className="material-symbols-outlined text-primary cursor-pointer hover:text-on-surface transition-colors">mail</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
