import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onDemo }) => {
  return (
    <div className="bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-20 pb-28 sm:pt-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-emerald-700 mb-8 border border-emerald-100 shadow-sm animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            New: Auto-remediation for idle EC2
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-tight">
            Stop burning <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">money</span><br className="hidden md:block"/> on cloud bills.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Saves</strong> by Pandey Solutions analyzes your AWS infrastructure securely to find instant savings. 
            No agents. No access keys. Just pure ROI.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-lg shadow-xl shadow-emerald-200 transition-all hover:-translate-y-1 ring-4 ring-transparent hover:ring-emerald-100"
            >
              Analyze My Cloud Free
            </button>
            <button 
              onClick={onDemo}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold rounded-xl text-lg transition-all shadow-sm hover:shadow-md"
            >
              View Live Demo
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-400 font-medium">
            SOC2 Compliant Architecture • Read-Only Access • Cancel Anytime
          </p>
        </div>
        
        {/* Abstract Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-60 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[50rem] h-[50rem] bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How Saves works</h2>
            <p className="mt-4 text-lg text-slate-600">Three steps to a lighter AWS bill.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="group p-6 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">1. Instant Valuation</h3>
              <p className="text-slate-600 leading-relaxed">Connect securely and see exactly how much you can save per month within 60 seconds.</p>
            </div>
            <div className="group p-6 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">2. Bank-Grade Security</h3>
              <p className="text-slate-600 leading-relaxed">We use AWS STS AssumeRole. No keys. No passwords. Strictly read-only permissions.</p>
            </div>
            <div className="group p-6 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">3. Actionable Fixes</h3>
              <p className="text-slate-600 leading-relaxed">Don't just see graphs. Get copy-paste CLI commands to fix unused EBS volumes and idle EC2s.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};