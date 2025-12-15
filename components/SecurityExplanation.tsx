import React from 'react';

export const SecurityExplanation: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-emerald-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
        Why this is safe
      </h3>
      <ul className="space-y-3 text-sm text-slate-600">
        <li className="flex gap-3">
          <div className="min-w-1 w-1 h-full bg-emerald-200 rounded-full"></div>
          <div>
            <strong className="text-slate-800">No Long-Term Keys:</strong> We never ask for Access Keys or Secret Keys. You are creating a Role that we can only "assume" temporarily.
          </div>
        </li>
        <li className="flex gap-3">
          <div className="min-w-1 w-1 h-full bg-emerald-200 rounded-full"></div>
          <div>
            <strong className="text-slate-800">The "External ID":</strong> This random string prevents the "Confused Deputy" problem. Only your specific SpotSave account can assume this role.
          </div>
        </li>
        <li className="flex gap-3">
          <div className="min-w-1 w-1 h-full bg-emerald-200 rounded-full"></div>
          <div>
            <strong className="text-slate-800">Read-Only Access:</strong> The policies attached are strictly read-only. We cannot modify your infrastructure, delete resources, or see sensitive data like S3 object contents.
          </div>
        </li>
        <li className="flex gap-3">
          <div className="min-w-1 w-1 h-full bg-emerald-200 rounded-full"></div>
          <div>
            <strong className="text-slate-800">Audit & Revoke:</strong> You can see every action we take in your CloudTrail logs. You can delete the CloudFormation stack instantly to revoke our access.
          </div>
        </li>
      </ul>
      <div className="pt-4 border-t border-slate-100">
        <a href="#" className="text-emerald-600 text-sm font-medium hover:underline flex items-center gap-1">
          View CloudFormation Template on GitHub
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 18h-8.5A2.25 2.25 0 0 1 2 15.75v-8.5A2.25 2.25 0 0 1 4.25 5h4a.75.75 0 0 1 0 1.5h-4Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};