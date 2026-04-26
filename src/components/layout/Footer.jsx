import React from 'react';
import TransitionLink from '../common/TransitionLink';

const Footer = () => {
  return (
    <footer className="bg-surface-dim w-full py-12 border-t border-outline-variant/10 mt-20">
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
        <div className="mt-4 flex gap-4">
          <span className="material-symbols-outlined text-primary cursor-pointer hover:text-on-surface transition-colors">share</span>
          <span className="material-symbols-outlined text-primary cursor-pointer hover:text-on-surface transition-colors">mail</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
