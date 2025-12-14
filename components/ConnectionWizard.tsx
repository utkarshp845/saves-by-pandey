import React, { useState } from 'react';
import { SPOTSAVE_AWS_ACCOUNT_ID, CF_CONSOLE_URL, CF_TEMPLATE_BODY, STACK_NAME } from '../constants';
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

  const handleDownloadTemplate = () => {
    const blob = new Blob([CF_TEMPLATE_BODY], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saves-integration.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            CloudFormation (Manual)
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
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Download the template and upload it to the AWS Console.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={handleDownloadTemplate}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 12.75l-3-3m0 0 3-3m-3 3h15" transform="rotate(-90 12 12)" />
                    </svg>
                    Download Template
                  </button>
                  <a 
                    href={CF_CONSOLE_URL}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Open Console &rarr;
                  </a>
                </div>
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
                  <strong>Instructions:</strong>
                  <ol className="list-decimal ml-4 mt-1 space-y-1">
                    <li>Click <strong>Download Template</strong> to save the YAML file.</li>
                    <li>Click <strong>Open Console</strong> to visit AWS CloudFormation.</li>
                    <li>Select <strong>"Upload a template file"</strong> and choose the file.</li>
                    <li>Enter Stack Name: <code>{STACK_NAME}</code></li>
                    <li>Paste External ID: <code>{externalId}</code></li>
                  </ol>
                </div>
              </div>
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