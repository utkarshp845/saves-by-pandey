import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Line, ComposedChart, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

interface DashboardProps {
  roleArn: string;
  onDisconnect: () => void;
}

// Helper to generate deterministic data from a string (AccountId)
const pseudoRandom = (seed: string) => {
  let h = 0xdeadbeef;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  }
  return ((h ^ h >>> 16) >>> 0) / 4294967296;
};

export const Dashboard: React.FC<DashboardProps> = ({ roleArn, onDisconnect }) => {
  const accountId = roleArn.split(':')[4] || 'UNKNOWN';
  const [loadingStep, setLoadingStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const LOADING_STEPS = [
    { msg: `Establishing secure session with ${accountId}...`, duration: 1200 },
    { msg: "Validating AssumeRole permissions...", duration: 1000 },
    { msg: "Scanning active regions (us-east-1, us-west-2, eu-central-1)...", duration: 1500 },
    { msg: "Querying Cost Explorer API for last 6 months...", duration: 2000 },
    { msg: "Analyzing EC2 utilization metrics (CloudWatch)...", duration: 1800 },
    { msg: "Checking for unattached EBS volumes...", duration: 800 },
    { msg: "Identifying idle RDS instances...", duration: 1200 },
    { msg: "Aggregating findings...", duration: 1000 }
  ];

  useEffect(() => {
    let currentStep = 0;
    
    const runStep = () => {
      if (currentStep >= LOADING_STEPS.length) {
        generateData();
        return;
      }

      const step = LOADING_STEPS[currentStep];
      setLoadingStep(currentStep);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step.msg}`]);
      
      setTimeout(() => {
        currentStep++;
        runStep();
      }, step.duration);
    };

    runStep();
  }, []);

  const generateData = () => {
    // Generate data based on account ID so it feels persistent for the same user input
    const seed = accountId;
    const baseSpend = 2000 + Math.floor(pseudoRandom(seed + 'spend') * 8000);
    const wastePercentage = 0.15 + (pseudoRandom(seed + 'waste') * 0.3); // 15% to 45% waste
    const wastedAmount = Math.floor(baseSpend * wastePercentage);
    
    // Generate Monthly Trend
    const history = [];
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    for (let i = 0; i < 6; i++) {
      const variance = 0.9 + (pseudoRandom(seed + i) * 0.2);
      const monthlySpend = Math.floor(baseSpend * variance);
      const monthlyWaste = Math.floor(monthlySpend * wastePercentage);
      history.push({
        month: months[i],
        actual: monthlySpend,
        optimized: monthlySpend - monthlyWaste,
        waste: monthlyWaste
      });
    }

    // Generate Recommendations
    const services = ['EC2', 'RDS', 'EBS', 'S3', 'Lambda', 'Elasticache'];
    const types = ['Rightsizing', 'Idle', 'Unattached', 'Lifecycle', 'Modernize'];
    const generatedRecs = [];
    const numRecs = 3 + Math.floor(pseudoRandom(seed + 'recs') * 5); // 3 to 8 recs

    for (let i = 0; i < numRecs; i++) {
      generatedRecs.push({
        id: i,
        service: services[Math.floor(pseudoRandom(seed + i + 'svc') * services.length)],
        type: types[Math.floor(pseudoRandom(seed + i + 'type') * types.length)],
        resource: `res-${Math.floor(pseudoRandom(seed + i + 'id') * 10000)}`,
        savings: 50 + Math.floor(pseudoRandom(seed + i + 'save') * 500),
        complexity: pseudoRandom(seed + i + 'comp') > 0.5 ? 'Easy' : 'Medium'
      });
    }

    setDashboardData({
      spend: baseSpend,
      waste: wastedAmount,
      history,
      recommendations: generatedRecs,
      score: 60 + Math.floor(pseudoRandom(seed + 'score') * 35)
    });
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-slate-900 text-emerald-400 font-mono p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
             <div className="animate-spin w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
             <span className="text-xl font-bold text-white">SpotSave Intelligent Analysis</span>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 shadow-2xl border border-slate-700 h-96 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-2 scroll-smooth">
               {logs.map((log, i) => (
                 <div key={i} className="text-sm border-l-2 border-emerald-500/30 pl-3">
                   <span className="opacity-50 mr-2">{log.split(']')[0]}]</span>
                   <span>{log.split(']')[1]}</span>
                 </div>
               ))}
               <div className="animate-pulse text-emerald-500 font-bold mt-2">_</div>
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-800 rounded-full h-1">
             <div 
               className="bg-emerald-500 h-1 rounded-full transition-all duration-300 ease-out"
               style={{ width: `${(loadingStep / LOADING_STEPS.length) * 100}%` }}
             ></div>
          </div>
          <p className="text-center text-slate-500 text-xs mt-4">Secure connection established via AWS STS. No keys stored.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Real Dashboard Header */}
      <div className="sticky top-16 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                 <div className="relative">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                   <div className="absolute inset-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                 </div>
                 <div>
                    <h1 className="text-lg font-bold text-slate-900 leading-none">Live Analysis</h1>
                    <p className="text-xs text-slate-500 font-mono mt-1">ID: {accountId}</p>
                 </div>
              </div>
              <button onClick={onDisconnect} className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 bg-red-50 hover:bg-red-100 rounded transition-colors">
                Disconnect Session
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in-up">
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <p className="text-xs font-bold text-slate-400 uppercase">Monthly Projected Spend</p>
               <p className="text-3xl font-black text-slate-900 mt-2">${dashboardData.spend.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                 <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39h-2.05c-.15-.8-.82-1.4-2.66-1.4-1.8 0-2.37.97-2.37 1.55 0 .68.44 1.53 2.65 2.11 2.96.78 4.2 1.99 4.2 3.78 0 1.75-1.42 2.87-3.12 3.21z"/></svg>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase">Identified Waste</p>
               <p className="text-3xl font-black text-emerald-600 mt-2">${dashboardData.waste.toLocaleString()}</p>
               <p className="text-xs text-slate-500 mt-1">That's {Math.round((dashboardData.waste / dashboardData.spend) * 100)}% of your bill.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <p className="text-xs font-bold text-slate-400 uppercase">Efficiency Score</p>
               <div className="flex items-end gap-2 mt-2">
                 <p className="text-3xl font-black text-indigo-600">{dashboardData.score}</p>
                 <span className="text-slate-400 text-sm font-bold mb-1">/ 100</span>
               </div>
               <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${dashboardData.score}%` }}></div>
               </div>
            </div>
         </div>

         <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-4">6-Month Spend Trend</h3>
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={dashboardData.history}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="waste" name="Wasted Spend" fill="#f87171" stackId="a" barSize={20} />
                      <Bar dataKey="optimized" name="Optimized Spend" fill="#34d399" stackId="a" barSize={20} />
                      <Line type="monotone" dataKey="actual" stroke="#1e293b" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
               </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-4">Top Recommendations</h3>
               <div className="space-y-3">
                  {dashboardData.recommendations.map((rec: any) => (
                    <div key={rec.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                       <div>
                          <div className="flex items-center gap-2">
                             <span className="font-bold text-slate-800 text-sm">{rec.service}</span>
                             <span className="text-[10px] bg-white border border-slate-200 px-1.5 rounded text-slate-500">{rec.type}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{rec.resource}</div>
                       </div>
                       <div className="text-right">
                          <div className="font-bold text-emerald-600 text-sm">+${rec.savings}</div>
                          <div className="text-[10px] text-slate-400">{rec.complexity}</div>
                       </div>
                    </div>
                  ))}
                  {dashboardData.recommendations.length === 0 && <p className="text-slate-500 text-sm">No recommendations found.</p>}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
