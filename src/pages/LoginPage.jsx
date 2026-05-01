import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const vantaRef = useRef(null);
  const { signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate(-1); // Go back if already logged in
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!vantaRef.current || !window.VANTA) return;
    
    const effect = window.VANTA.FOG({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      highlightColor: 0xAAA396,
      midtoneColor: 0xF1EADA,
      lowlightColor: 0xCEC1AB,
      baseColor: 0xB59E7D,
      blurFactor: 0.37,
      zoom: 0.70,
      speed: 1.30
    });

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(-1);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center relative">
      <div ref={vantaRef} className="fixed inset-0 z-0 opacity-50" />
      
      <div className="relative z-10 p-12 text-center max-w-md w-full bg-surface-container-lowest/40 backdrop-blur-sm rounded-2xl border border-outline-variant/20 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-serif italic tracking-tighter text-on-surface mb-12 drop-shadow-sm">
          The Boomer Archives
        </h1>
        
        <button 
          onClick={handleSignIn}
          className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface py-4 px-8 rounded-full text-xs font-medium uppercase tracking-[0.2em] hover:bg-surface-variant hover:border-primary/50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Authenticate with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
