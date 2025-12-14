import React, { useState, useEffect } from 'react';
import { ConnectionWizard } from './components/ConnectionWizard';
import { SecurityExplanation } from './components/SecurityExplanation';
import { LandingPage } from './components/LandingPage';
import { DemoDashboard } from './components/DemoDashboard';
import { Alert } from './components/Alert';
import { db } from './lib/supabase';

type ViewState = 'landing' | 'wizard' | 'demo';

interface AppError {
  type: 'error' | 'warning' | 'success';
  title: string;
  message: string;
}

// Simple Loading Component for better UX
const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
      </div>
    </div>
    <span className="text-slate-600 font-medium animate-pulse">{message}</span>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  
  // In a real app, this comes from your Auth Provider / Backend API
  const [externalId, setExternalId] = useState<string>(''); 
  const [sessionId, setSessionId] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<AppError | null>(null);

  useEffect(() => {
    // Fetch or create session from Supabase (with fallback)
    const initSession = async () => {
      try {
        setLoading(true);
        const { externalId: id, sessionId: sid } = await db.createOrGetSession();
        setExternalId(id);
        setSessionId(sid);
      } catch (err: any) {
        console.error('Session initialization error:', err);
        // Even if there's an error, try to use localStorage fallback
        try {
          const fallbackId = localStorage.getItem('spotsave_external_id') || crypto.randomUUID();
          const fallbackSessionId = localStorage.getItem('spotsave_session_id') || crypto.randomUUID();
          setExternalId(fallbackId);
          setSessionId(fallbackSessionId);
          // Store for next time
          if (!localStorage.getItem('spotsave_external_id')) {
            localStorage.setItem('spotsave_external_id', fallbackId);
            localStorage.setItem('spotsave_session_id', fallbackSessionId);
          }
        } catch (storageErr) {
          // If localStorage also fails, just generate new IDs
          const fallbackId = crypto.randomUUID();
          const fallbackSessionId = crypto.randomUUID();
          setExternalId(fallbackId);
          setSessionId(fallbackSessionId);
        }
        // Don't show error to user - app should still work
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, []);

  const handleConnect = async (roleArn: string) => {
    setLoading(true);
    setFeedback(null);

    try {
      // 1. Validation Phase
      if (!roleArn.startsWith('arn:aws:iam::')) {
        throw new Error("Invalid ARN format. Must start with 'arn:aws:iam::'.");
      }
      
      const accountId = roleArn.split(':')[4];
      if (!accountId || accountId.length !== 12 || isNaN(Number(accountId))) {
         throw new Error("Invalid AWS Account ID in ARN. Must be 12 digits.");
      }

      console.log(`Verifying ${roleArn} with External ID ${externalId}...`);
      
      // 2. Network/API Phase (Simulated)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Randomly simulate a network failure for demonstration (10% chance)
          if (Math.random() < 0.1) {
             reject(new Error("Network timeout: Could not reach AWS STS service."));
             return;
          }
          resolve(true);
        }, 2000);
      });

      // Store role ARN in database
      if (sessionId) {
        try {
          await db.updateSessionRole(sessionId, roleArn);
        } catch (dbError) {
          console.warn('Failed to save role ARN to database:', dbError);
          // Continue anyway - connection is still successful
        }
      }

      // Success
      setIsConnected(true);
      setFeedback({
        type: 'success',
        title: 'Connection Successful',
        message: 'Redirecting to your analysis dashboard...'
      });
      
      setTimeout(() => {
        setLoading(false);
        setView('demo');
        setFeedback(null); // Clear success message after transition
      }, 1500);

    } catch (err: any) {
      setLoading(false);
      console.error("Connection Error:", err);
      
      // Categorize errors
      let errorMessage = "An unexpected error occurred.";
      let errorTitle = "Connection Failed";

      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setFeedback({
        type: 'error',
        title: errorTitle,
        message: errorMessage
      });
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onStart={() => setView('wizard')} onDemo={() => setView('demo')} />;
      
      case 'demo':
        return <DemoDashboard onConnect={() => setView('wizard')} isConnected={isConnected} />;

      case 'wizard':
        if (!externalId && !feedback) {
          return <LoadingSpinner message="Initializing secure handshake..." />;
        }
        return (
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 items-start py-12 px-4 animate-fade-in-up">
             <div className="lg:col-span-3 mb-4">
                <button 
                  onClick={() => {
                    setView('landing');
                    setFeedback(null);
                  }}
                  className="group flex items-center text-slate-500 hover:text-emerald-600 font-medium transition-colors"
                >
                  <div className="bg-white border border-slate-200 rounded-full p-1 mr-2 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                  </div>
                  Back to Home
                </button>
             </div>

             <div className="lg:col-span-2 space-y-6">
                {feedback && (
                  <Alert 
                    type={feedback.type} 
                    title={feedback.title} 
                    message={feedback.message} 
                    onClose={() => setFeedback(null)} 
                  />
                )}
               
               <ConnectionWizard 
                  externalId={externalId} 
                  onConnect={handleConnect}
                  isLoading={loading}
                />
             </div>
             
             <div className="lg:col-span-1 sticky top-8">
               <SecurityExplanation />
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer group" onClick={() => setView('landing')}>
              <div className="bg-slate-900 text-white p-1.5 rounded-lg mr-3 shadow-md group-hover:bg-emerald-600 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none group-hover:text-emerald-700 transition-colors">SpotSave</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">by Pandey Solutions</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setView('demo')}
                className={`text-sm font-semibold px-3 py-1.5 rounded-md transition-all ${view === 'demo' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:text-emerald-600'}`}
              >
                Live Demo
              </button>
              <button 
                onClick={() => setView('wizard')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-slate-200 hover:shadow-slate-300 transform hover:-translate-y-0.5"
              >
                Start Saving
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;