import React from 'react';

interface LandingPageProps {
  onStart: () => void;
  onDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onDemo }) => {
  return (
    <div className="bg-slate-50 overflow-hidden min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative pt-20 pb-20 sm:pt-28 sm:pb-32 flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-emerald-700 mb-8 border border-emerald-100 shadow-sm animate-fade-in-up hover:scale-105 transition-transform cursor-default select-none">
            <span className="relative flex h-2.5 w-2.5 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Live: Automated Savings Analysis
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Save <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">50%</span> on AWS<br className="hidden md:block"/> in just 5 minutes.
          </h1>

          {/* Subheadline */}
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed font-medium">
            SpotSave analyzes your infrastructure securely to uncover hidden waste. <br className="hidden sm:block" />
            No agents. No credentials shared. Pure ROI.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={onStart}
              className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-lg shadow-xl shadow-emerald-200 transition-all hover:-translate-y-1 ring-4 ring-transparent hover:ring-emerald-100 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span>Start Saving Free</span>
            </button>
            <button 
              onClick={onDemo}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-xl text-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              View Live Demo
            </button>
          </div>
          
          {/* Trust/Social Proof */}
          <p className="mt-8 text-sm text-slate-400 font-medium">
             SOC2 Compliant Architecture • Read-Only Access • Cancel Anytime
          </p>

        </div>
        
        {/* Animated Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 opacity-60 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob will-change-transform"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 will-change-transform"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[50rem] h-[50rem] bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 will-change-transform"></div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="py-24 bg-white border-t border-slate-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How SpotSave works</h2>
            <p className="mt-4 text-lg text-slate-600">Three steps to a lighter AWS bill.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="group p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
              <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">1. Instant Valuation</h3>
              <p className="text-slate-600 leading-relaxed">Connect securely and see exactly how much you can save per month within 60 seconds.</p>
            </div>
            <div className="group p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">2. Bank-Grade Security</h3>
              <p className="text-slate-600 leading-relaxed">We use AWS STS AssumeRole. No keys. No passwords. Strictly read-only permissions.</p>
            </div>
            <div className="group p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-sm">
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