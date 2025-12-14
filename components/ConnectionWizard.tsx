import React, { useState } from 'react';
import { SPOTSAVE_AWS_ACCOUNT_ID, CF_TEMPLATE_URL, STACK_NAME } from '../constants';
import { CloudShellScript } from './CloudShellScript';

interface ConnectionWizardProps {
  externalId: string;
  onConnect: (arn: string) => Promise<void>;
  isLoading: boolean;
}

export const ConnectionWizard: React.FC<ConnectionWizardProps> = ({ externalId, onConnect, isLoading }) => {
  const [roleArn, setRoleArn] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<'cloudformation' | 'cli'>('cloudformation');

  const getLaunchStackUrl = () => {
    const baseUrl = "https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/review";
    const params = new URLSearchParams({
      templateURL: CF_TEMPLATE_URL,
      stackName: STACK_NAME,
      param_ExternalId: externalId,
      param_SpotSaveAccountId: SPOTSAVE_AWS_ACCOUNT_ID
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleArn.startsWith('arn:aws:iam::')) {
      setError("Please enter a valid IAM Role ARN.");
      return;
    }
    setError(null);
    await onConnect(roleArn);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto ring-1 ring-slate-100">
      <div className="bg-emerald-600 px-6 py-5 border-b border-emerald-700 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <h2 className="text-xl font-bold text-white">Connect AWS Account</h2>
        <p className="text-sm text-emerald-100 mt-1">Securely grant read-only access to Saves.</p>
      </div>

      <div className="p-8 space-y-8">
        
        {/* Method Toggle */}
        <div className="flex justify-center border-b border-slate-200 pb-1">
          <button
            onClick={() => setMethod('cloudformation')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${method === 'cloudformation' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            CloudFormation (Recommended)
          </button>
          <button
            onClick={() => setMethod('cli')}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${method === 'cli' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            CLI / CloudShell
          </button>
        </div>

        {/* Step 1: External ID */}
        <div className="flex gap-4">
          <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm ring-4 ring-emerald-50">1</div>
          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-slate-900">Your Secure ID</h3>
            <p className="text-sm text-slate-600">This random ID acts as a secret handshake between Saves and your AWS account.</p>
            <div className="flex items-center gap-2 mt-2 group">
              <code className="bg-slate-50 border border-slate-200 rounded px-3 py-2 font-mono text-sm text-slate-700 flex-1 select-all transition-colors group-hover:border-emerald-300">
                {externalId}
              </code>
              <button 
                onClick={() => navigator.clipboard.writeText(externalId)}
                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Create Role */}
        <div className="flex gap-4">
          <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm ring-4 ring-emerald-50">2</div>
          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-slate-900">Create Access Role</h3>
            
            {method === 'cloudformation' ? (
              <>
                <p className="text-sm text-slate-600">
                  Launch the pre-configured stack. It creates a read-only role for Saves.
                </p>
                <div className="mt-3">
                  <a 
                    href={getLaunchStackUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.923 15.36c.49-.675.76-1.5.76-2.39 0-2.3-1.78-4.14-4-4.14s-4 1.84-4 4.14c0 2.3 1.78 4.14 4 4.14.39 0 .78-.05 1.14-.16l2.1 2.58v-4.17zM9.683 15.2c-1.2 0-2.18-.99-2.18-2.22s.98-2.22 2.18-2.22 2.18.99 2.18 2.22-.98 2.22-2.18 2.22zM19.463 8.68l-4.5-5.32a.98.98 0 00-.77-.36H3.773c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1h16.44c.55 0 1-.45 1-1V9.45a.99.99 0 00-.25-.77zm-1.25 10.32H5.773v-14h8.21v4.22h4.23v9.78z"/>
                    </svg>
                    Launch Stack
                  </a>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Opens AWS Console • Takes ~30s</p>
                </div>
              </>
            ) : (
              <>
                 <p className="text-sm text-slate-600">
                  Execute this snippet in CloudShell to create the stack instantly.
                </p>
                <div className="mt-3">
                   <CloudShellScript externalId={externalId} />
                   <div className="mt-2 text-xs text-slate-500">
                      <a href="https://console.aws.amazon.com/cloudshell/home" target="_blank" rel="noreferrer" className="text-emerald-600 underline hover:text-emerald-800 font-medium">Open AWS CloudShell &rarr;</a>
                   </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Step 3: Input ARN */}
        <div className="flex gap-4">
          <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm ring-4 ring-emerald-50">3</div>
          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-slate-900">Connect</h3>
            <p className="text-sm text-slate-600">
              {method === 'cloudformation' 
                ? <span>Paste the <strong>RoleArn</strong> from the CloudFormation "Outputs" tab.</span>
                : <span>Paste the ARN output from the script.</span>
              }
            </p>
            <form onSubmit={handleSubmit} className="mt-2 space-y-3">
              <div>
                <label htmlFor="roleArn" className="sr-only">Role ARN</label>
                <input
                  type="text"
                  id="roleArn"
                  placeholder="arn:aws:iam::123456789012:role/..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder-slate-400 shadow-sm"
                  value={roleArn}
                  onChange={(e) => setRoleArn(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-red-600 text-xs font-semibold flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {error}
              </p>}
              <button
                type="submit"
                disabled={isLoading || !roleArn}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Finalize Connection"
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};