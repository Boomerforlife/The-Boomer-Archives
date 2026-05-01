import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthModal = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[12px] bg-[#0a0a0a]/70">
      <div className="bg-surface p-8 md:p-12 border border-[#d4af37]/20 max-w-lg w-full text-center whisper-shadow shadow-2xl">
        <h2 className="font-serif italic text-3xl md:text-4xl text-on-surface mb-8 leading-snug">
          The Archives are reserved for members.
        </h2>
        <button
          onClick={() => navigate('/login')}
          className="bg-primary text-on-primary py-3 px-8 rounded-sm text-xs font-medium uppercase tracking-widest label-text hover:opacity-90 transition-all border border-primary/50"
        >
          Enter the Vault (Sign In)
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
