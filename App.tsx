import React, { useState, useEffect } from 'react';
import { ConnectionWizard } from './components/ConnectionWizard';
import { SecurityExplanation } from './components/SecurityExplanation';
import { LandingPage } from './components/LandingPage';
import { DemoDashboard } from './components/DemoDashboard';

type ViewState = 'landing' | 'wizard' | 'demo';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  
  // In a real app, this comes from your Auth Provider / Backend API
  const [externalId, setExternalId] = useState<string>(''); 
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching the generated External ID from backend
    setTimeout(() => {
      setExternalId('550e8400-e29b-41d4-a716-446655440000');
    }, 500);
  }, []);

  const handleConnect = async (roleArn: string) => {
    setLoading(true);
    // Simulate Backend API Call to verify ARN
    console.log(`Verifying ${roleArn} with External ID ${externalId}...`);
    
    setTimeout(() => {
      setLoading(false);
      setIsConnected(true);
      setView('demo'); // Redirect to dashboard on success (mock)
    }, 2000);
  };

  const renderContent = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onStart={() => setView('wizard')} onDemo={() => setView('demo')} />;
      
      case 'demo':
        return <DemoDashboard onConnect={() => setView('wizard')} isConnected={isConnected} />;

      case 'wizard':
        if (!externalId) {
          return <div className="min-h-[50vh] flex items-center justify-center text-emerald-600 font-medium animate-pulse">Initializing secure handshake...</div>;
        }
        return (
          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 items-start py-12 px-4">
             <div className="lg:col-span-3 mb-4">
                <button 
                  onClick={() => setView('landing')}
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

             <div className="lg:col-span-2 space-y-8">
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
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer group" onClick={() => setView('landing')}>
              <div className="bg-emerald-600 text-white p-1.5 rounded-lg mr-3 shadow-sm group-hover:bg-emerald-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">Saves</span>
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