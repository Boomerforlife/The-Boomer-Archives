import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopAppBar from '../components/layout/TopAppBar';
import Footer from '../components/layout/Footer';
import { addSubscriber } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';
import { z } from 'zod';

const SubscribePage = () => {
  const { currentUser, isApprovedMember, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const subscribeSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters"),
    email: z.string().email("Invalid email address")
  });

  useEffect(() => {
    if (currentUser) {
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.displayName) setName(currentUser.displayName);
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      subscribeSchema.parse({ name: name.trim(), email: email.trim() });
      setValidationError('');
    } catch (err) {
      setValidationError(err.errors[0].message);
      return;
    }

    setStatus('loading');
    try {
      await addSubscriber(email, name);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <TopAppBar visible={true} />
      <main className="flex-1 flex flex-col items-center justify-center p-8 mt-16">
        <div className="max-w-md w-full bg-surface-container rounded-2xl p-8 md:p-12 whisper-shadow border border-outline-variant/20 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-6">mail</span>
          <h1 className="text-3xl font-serif italic text-on-surface mb-4">Join the Archives</h1>
          
          {isApprovedMember ? (
            <div className="bg-primary/10 text-primary p-6 rounded-xl mt-8">
              <span className="material-symbols-outlined mb-2 text-3xl">workspace_premium</span>
              <p className="font-medium mt-2">You are already a member, thank you and enjoy!!</p>
              <button 
                onClick={() => navigate('/')} 
                className="mt-6 text-xs uppercase tracking-widest font-bold border-b border-primary/30 pb-1 hover:border-primary transition-colors inline-block"
              >
                Return Home
              </button>
            </div>
          ) : !currentUser ? (
             <div className="mt-8">
                <p className="text-on-surface-variant mb-8 leading-relaxed">
                  Discover new perspectives, reflections, and volumes delivered directly to your inbox. Please authenticate to continue.
                </p>
                <button 
                  onClick={signInWithGoogle}
                  className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface py-4 px-8 rounded-full text-xs font-medium uppercase tracking-[0.2em] hover:bg-surface-variant hover:border-primary/50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </button>
             </div>
          ) : (
            <>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Discover new perspectives, reflections, and volumes delivered directly to your inbox.
              </p>
              
              {status === 'success' ? (
                <div className="bg-primary/10 text-primary p-6 rounded-xl">
                  <span className="material-symbols-outlined mb-2 text-3xl">check_circle</span>
                  <p className="font-medium mt-2">Request sent! The Archivist will review your subscription soon.</p>
                  <button 
                    onClick={() => navigate('/')} 
                    className="mt-6 text-xs uppercase tracking-widest font-bold border-b border-primary/30 pb-1 hover:border-primary transition-colors inline-block"
                  >
                    Return Home
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setValidationError(''); }}
                    placeholder="Enter your name"
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={true}
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors opacity-70 cursor-not-allowed"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-primary text-on-primary font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {status === 'loading' ? 'Submitting...' : 'Request Access'}
                  </button>
                  {validationError && (
                    <p className="text-error text-sm mt-2">{validationError}</p>
                  )}
                  {status === 'error' && (
                    <p className="text-error text-sm mt-2">Failed to submit request. Please try again.</p>
                  )}
                </form>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubscribePage;
