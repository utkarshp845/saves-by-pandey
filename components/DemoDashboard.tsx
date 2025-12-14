import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, ComposedChart, Line, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

interface DemoDashboardProps {
  onConnect: () => void;
  isConnected: boolean;
}

// --- Mock Data ---

const INITIAL_SAVINGS_DATA = [
  { month: 'Aug', actual: 4200, optimized: 3100, waste: 1100 },
  { month: 'Sep', actual: 4350, optimized: 3150, waste: 1200 },
  { month: 'Oct', actual: 4100, optimized: 3050, waste: 1050 },
  { month: 'Nov', actual: 4800, optimized: 3100, waste: 1700 },
  { month: 'Dec', actual: 5100, optimized: 3200, waste: 1900 },
  { month: 'Jan', actual: 5400, optimized: 3250, waste: 2150 },
];

const HEALTH_DATA = [
  { subject: 'Cost Efficiency', A: 65, B: 95, fullMark: 100 },
  { subject: 'Security', A: 70, B: 100, fullMark: 100 },
  { subject: 'Reliability', A: 86, B: 90, fullMark: 100 },
  { subject: 'Performance', A: 80, B: 90, fullMark: 100 },
  { subject: 'Compliance', A: 50, B: 85, fullMark: 100 },
];

const INITIAL_RECOMMENDATIONS = [
  { id: 1, service: 'EC2', type: 'Rightsizing', resource: 'i-0ab12... (m5.2xlarge)', savings: 345, risk: 'Low', status: 'Open', complexity: 'Easy' },
  { id: 2, service: 'EBS', type: 'Unattached', resource: 'vol-098... (500GB gp2)', savings: 50, risk: 'None', status: 'Open', complexity: 'Instant' },
  { id: 3, service: 'RDS', type: 'Idle', resource: 'db-staging-01', savings: 120, risk: 'Medium', status: 'Open', complexity: 'Medium' },
  { id: 4, service: 'S3', type: 'Lifecycle', resource: 'logs-bucket-legacy', savings: 85, risk: 'Low', status: 'Open', complexity: 'Easy' },
  { id: 5, service: 'ELB', type: 'Unused', resource: 'elb-prod-legacy', savings: 25, risk: 'None', status: 'Open', complexity: 'Instant' },
];

// --- Components ---

export const DemoDashboard: React.FC<DemoDashboardProps> = ({ onConnect, isConnected }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'security'>('overview');
  const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS);
  const [realizedSavings, setRealizedSavings] = useState(0);
  const [potentialSavings, setPotentialSavings] = useState(
    INITIAL_RECOMMENDATIONS.reduce((acc, curr) => acc + curr.savings, 0)
  );

  // Animation for numbers
  const [displaySavings, setDisplaySavings] = useState(potentialSavings);
  
  useEffect(() => {
    let start = displaySavings;
    const end = potentialSavings;
    if (start === end) return;
    
    const duration = 500;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const ease = 1 - Math.pow(1 - progress, 4);
      
      setDisplaySavings(Math.floor(start + (end - start) * ease));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [potentialSavings]);

  const handleSimulateFix = (id: number, amount: number) => {
    // 1. Remove from list
    setRecommendations(prev => prev.filter(r => r.id !== id));
    // 2. Update totals
    setPotentialSavings(prev => prev - amount);
    setRealizedSavings(prev => prev + amount);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-4 rounded-lg shadow-xl border border-white/20 text-xs text-slate-800">
          <p className="font-bold mb-2 text-slate-900 border-b border-slate-200 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="font-medium">{entry.name}:</span>
              <span className="font-bold">${entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      
      {/* 1. Glass Header */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900">Infrastructure Health</h1>
                {!isConnected && (
                  <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Demo Mode
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                <span>Account: <span className="font-mono text-slate-700">aws-prod-01</span></span>
                <span className="hidden sm:inline text-slate-300">|</span>
                <span>Region: <span className="text-slate-700">us-east-1</span></span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="hidden md:flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'overview' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('security')}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'security' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Security
                  </button>
               </div>
               {!isConnected && (
                 <button onClick={onConnect} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2 rounded-lg shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5">
                   Connect AWS Account
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 2. KPI Cards - Interactive */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1: Potential Savings */}
          <div className="glass-panel p-6 rounded-2xl border border-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-16 h-16 text-emerald-600"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39h-2.05c-.15-.8-.82-1.4-2.66-1.4-1.8 0-2.37.97-2.37 1.55 0 .68.44 1.53 2.65 2.11 2.96.78 4.2 1.99 4.2 3.78 0 1.75-1.42 2.87-3.12 3.21z"/></svg>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Identified Savings</p>
            <div className="mt-2 flex items-baseline gap-1">
               <span className="text-3xl font-black text-slate-900 tracking-tight">${displaySavings.toLocaleString()}</span>
               <span className="text-sm font-semibold text-slate-400">/ mo</span>
            </div>
            {realizedSavings > 0 && (
               <div className="mt-3 inline-flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded text-[10px] font-bold text-emerald-700 animate-fade-in-up">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  ${realizedSavings} simulated saved
               </div>
            )}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
          </div>

          {/* Card 2: Health Score */}
          <div className="glass-panel p-6 rounded-2xl border border-white shadow-lg relative overflow-hidden group">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Health Score</p>
            <div className="mt-2 flex items-baseline gap-1">
               <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">B+</span>
               <span className="text-sm font-semibold text-slate-400">86/100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full" style={{ width: '86%' }}></div>
            </div>
          </div>

          {/* Card 3: Resources */}
          <div className="glass-panel p-6 rounded-2xl border border-white shadow-lg relative overflow-hidden">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resources Scanned</p>
             <div className="mt-2 flex items-baseline gap-1">
               <span className="text-3xl font-black text-slate-900">452</span>
            </div>
            <div className="mt-3 flex gap-2">
                {['EC2', 'RDS', 'S3', 'Lambda'].map(s => (
                  <span key={s} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded">{s}</span>
                ))}
            </div>
          </div>

          {/* Card 4: Action Items */}
          <div className="glass-panel p-6 rounded-2xl border border-white shadow-lg bg-slate-900 text-white relative overflow-hidden">
             <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500 rounded-full blur-2xl opacity-20"></div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Action Items</p>
             <div className="mt-2 flex items-baseline gap-1">
               <span className="text-3xl font-black text-white">{recommendations.length}</span>
               <span className="text-sm font-semibold text-slate-400">critical</span>
            </div>
             <p className="text-xs text-slate-400 mt-3">2 security, {recommendations.length - 2} cost</p>
          </div>
        </div>

        {/* 3. Main Visualizations */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Chart Left: Spend & Waste */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white shadow-md">
            <div className="flex items-center justify-between mb-6">
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Cost Trend Analysis</h3>
                  <p className="text-xs text-slate-500">Actual Spend vs. Optimized Baseline</p>
               </div>
               <div className="flex items-center gap-2">
                  <span className="flex items-center text-[10px] font-bold text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Optimized
                  </span>
                  <span className="flex items-center text-[10px] font-bold text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-slate-300 mr-1"></span> Waste
                  </span>
               </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={INITIAL_SAVINGS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(value) => `$${value}`} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                  <Legend />
                  <Bar dataKey="optimized" stackId="a" fill="#10b981" barSize={30} radius={[0, 0, 4, 4]} name="Optimized Spend" />
                  <Bar dataKey="waste" stackId="a" fill="url(#colorWaste)" barSize={30} radius={[4, 4, 0, 0]} name="Wasted Spend" />
                  <Line type="monotone" dataKey="actual" stroke="#334155" strokeWidth={2} dot={{r: 4, fill: '#334155'}} name="Total Actual Trend" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart Right: Health Radar */}
          <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-white shadow-md flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Infrastructure Posture</h3>
             <p className="text-xs text-slate-500 mb-4">Current vs. Industry Benchmarks</p>
             <div className="flex-1 min-h-[250px] relative">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={HEALTH_DATA}>
                   <PolarGrid gridType="polygon" stroke="#e2e8f0" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar
                     name="Your Account"
                     dataKey="A"
                     stroke="#10b981"
                     strokeWidth={2}
                     fill="#10b981"
                     fillOpacity={0.3}
                   />
                   <Radar
                     name="Target"
                     dataKey="B"
                     stroke="#6366f1"
                     strokeWidth={2}
                     fill="#6366f1"
                     fillOpacity={0.0}
                     strokeDasharray="4 4"
                   />
                   <Legend wrapperStyle={{fontSize: '10px', marginTop: '10px'}} />
                   <RechartsTooltip />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-800">
                <strong>Insight:</strong> Your compliance score is below average due to 3 unencrypted S3 buckets detected.
             </div>
          </div>
        </div>

        {/* 4. Recommendations Table with "Simulation" */}
        <div className="glass-panel rounded-2xl border border-white shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50">
             <div>
                <h3 className="text-lg font-bold text-slate-900">Optimization Opportunities</h3>
                <p className="text-sm text-slate-500">Fix these to realize the savings shown above.</p>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4">Finding</th>
                  <th className="px-6 py-4">Complexity</th>
                  <th className="px-6 py-4 text-right">Potential Savings</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recommendations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                       <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-3 text-emerald-200">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                          </svg>
                          <span className="font-medium text-slate-600">All caught up! Excellent work.</span>
                       </div>
                    </td>
                  </tr>
                ) : (
                  recommendations.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{rec.service}</div>
                        <div className="font-mono text-xs text-slate-500">{rec.resource}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          rec.type === 'Unattached' ? 'bg-red-50 text-red-700 border-red-100' :
                          rec.type === 'Rightsizing' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          'bg-blue-50 text-blue-700 border-blue-100'
                        }`}>
                          {rec.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                           <div className={`w-2 h-2 rounded-full ${
                             rec.complexity === 'Easy' || rec.complexity === 'Instant' ? 'bg-emerald-400' : 'bg-amber-400'
                           }`}></div>
                           <span className="text-slate-600">{rec.complexity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-emerald-600 text-base">+${rec.savings}</span>
                        <span className="text-xs text-slate-400 block">/ mo</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleSimulateFix(rec.id, rec.savings)}
                          className="group/btn relative inline-flex items-center justify-center px-4 py-1.5 overflow-hidden font-bold text-white transition-all duration-300 bg-slate-900 rounded-lg hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200"
                        >
                          <span className="mr-2">Simulate Fix</span>
                          <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};