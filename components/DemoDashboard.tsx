import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

interface DemoDashboardProps {
  onConnect: () => void;
  isConnected: boolean;
}

// Mock Data
const SAVINGS_DATA = [
  { month: 'Jan', actual: 4200, optimized: 3100 },
  { month: 'Feb', actual: 4350, optimized: 3150 },
  { month: 'Mar', actual: 4100, optimized: 3050 },
  { month: 'Apr', actual: 4800, optimized: 3100 },
  { month: 'May', actual: 5100, optimized: 3200 },
  { month: 'Jun', actual: 5400, optimized: 3250 },
];

const RECOMMENDATIONS = [
  { id: 1, service: 'EC2', type: 'Rightsizing', resource: 'i-0ab12... (m5.2xlarge)', savings: 345, risk: 'Low', status: 'Open' },
  { id: 2, service: 'EBS', type: 'Unattached', resource: 'vol-098... (500GB gp2)', savings: 50, risk: 'None', status: 'Open' },
  { id: 3, service: 'RDS', type: 'Idle', resource: 'db-staging-01', savings: 120, risk: 'Medium', status: 'Open' },
  { id: 4, service: 'S3', type: 'Lifecycle', resource: 'logs-bucket-legacy', savings: 85, risk: 'Low', status: 'Open' },
];

export const DemoDashboard: React.FC<DemoDashboardProps> = ({ onConnect, isConnected }) => {
  const [timeRange, setTimeRange] = useState('6M');
  const [activeTab, setActiveTab] = useState('overview');

  // Defensive Check: Ensure data exists before rendering
  if (!SAVINGS_DATA || SAVINGS_DATA.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800">No Data Available</h3>
                <p className="text-slate-500">Could not load visualization data.</p>
                <button onClick={() => window.location.reload()} className="mt-4 text-emerald-600 underline">Retry</button>
            </div>
        </div>
    );
  }

  // If connected, we might show "real" data (simulated for now)
  const displayData = SAVINGS_DATA; 

  const totalPotentialSavings = 2150; // Monthly
  const optimizationScore = 64;

  const CustomTooltip = ({ active, payload, label }: any) => {
    try {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs">
                <p className="font-bold mb-1">{label}</p>
                <p className="text-emerald-400">Optimized: ${payload[0]?.value}</p>
                <p className="text-slate-400">Actual: ${payload[1]?.value}</p>
                <p className="mt-1 pt-1 border-t border-slate-700 font-bold text-amber-400">
                    Waste: ${(payload[1]?.value || 0) - (payload[0]?.value || 0)}
                </p>
                </div>
            );
        }
    } catch (e) {
        console.warn("Tooltip render error", e);
    }
    return null;
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. Header Section */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <h1 className="text-2xl font-bold text-slate-900">Infrastructure Overview</h1>
                 {!isConnected && (
                   <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                     Demo Mode
                   </span>
                 )}
              </div>
              <p className="text-slate-500 text-sm">Last analyzed: <span className="font-medium text-slate-700">Just now</span></p>
            </div>
            
            {!isConnected && (
               <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-3 rounded-lg animate-fade-in-up">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-indigo-900 uppercase">Unlock your data</p>
                    <p className="text-xs text-indigo-700">Connect your account for real insights.</p>
                  </div>
                  <button onClick={onConnect} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2 rounded-md shadow-sm transition-all whitespace-nowrap">
                    Connect AWS
                  </button>
               </div>
            )}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider relative z-10">Monthly Savings</p>
              <div className="text-3xl font-bold text-emerald-600 mt-1 relative z-10">${totalPotentialSavings.toLocaleString()}</div>
              <div className="text-xs text-emerald-700 mt-2 font-medium flex items-center relative z-10">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8-8 8-4-4-6 6" /></svg>
                Identified today
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider relative z-10">Optimization Score</p>
              <div className="flex items-end gap-2 mt-1 relative z-10">
                <div className="text-3xl font-bold text-slate-900">{optimizationScore}</div>
                <div className="text-sm text-slate-400 font-medium mb-1">/ 100</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${optimizationScore}%` }}></div>
              </div>
            </div>

             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider relative z-10">Wasted Spend</p>
              <div className="text-3xl font-bold text-slate-900 mt-1 relative z-10">$25,800</div>
              <p className="text-xs text-slate-400 mt-2">Annualized projection</p>
            </div>

             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider relative z-10">Active Resources</p>
              <div className="text-3xl font-bold text-slate-900 mt-1 relative z-10">142</div>
              <p className="text-xs text-slate-400 mt-2">Across 3 regions</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Visualizations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Spend Forecast vs. Optimized</h3>
              <div className="flex bg-slate-100 rounded-lg p-1">
                {['1M', '3M', '6M', '1Y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeRange === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(value) => `$${value}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="optimized" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorOptimized)" />
                  <Area type="monotone" dataKey="actual" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorActual)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-400 opacity-50"></div>
                <span className="text-slate-500">Current Spend</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-slate-900 font-medium">After Saves</span>
              </div>
            </div>
          </div>

          {/* Breakdown / Distribution */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Savings by Service</h3>
            <div className="flex-1 flex items-center justify-center relative">
               <ResponsiveContainer width="100%" height={250}>
                 <PieChart>
                    <Pie
                      data={[
                        { name: 'EC2', value: 450, color: '#059669' },
                        { name: 'EBS', value: 300, color: '#10b981' },
                        { name: 'RDS', value: 200, color: '#34d399' },
                        { name: 'Other', value: 150, color: '#a7f3d0' },
                      ]}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[{color: '#059669'}, {color: '#10b981'}, {color: '#34d399'}, {color: '#a7f3d0'}].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff'}}
                      itemStyle={{color: '#fff'}}
                    />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-2xl font-bold text-slate-900">4 Sources</span>
                  <span className="text-xs text-slate-500">Detected</span>
               </div>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Compute (EC2)', value: '45%', color: 'bg-emerald-600' },
                { label: 'Storage (EBS)', value: '25%', color: 'bg-emerald-500' },
                { label: 'Database (RDS)', value: '15%', color: 'bg-emerald-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                    <span className="text-slate-600">{item.label}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Detailed Action List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <h3 className="text-lg font-bold text-slate-900">Top Recommendations</h3>
             <div className="flex gap-2">
               <button className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">Export CSV</button>
               <button className="px-3 py-1.5 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">Filter</button>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Finding Type</th>
                  <th className="px-6 py-4">Resource ID</th>
                  <th className="px-6 py-4">Est. Savings</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {RECOMMENDATIONS.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{rec.service}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rec.type === 'Unattached' ? 'bg-red-100 text-red-800' :
                        rec.type === 'Rightsizing' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{rec.resource}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">+${rec.savings}/mo</td>
                    <td className="px-6 py-4">
                      <button className="text-indigo-600 hover:text-indigo-900 font-medium hover:underline">
                        View Fix &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isConnected && (
            <div className="bg-slate-50 p-4 text-center border-t border-slate-200">
              <p className="text-sm text-slate-500">Connect your account to see your actual resources.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};