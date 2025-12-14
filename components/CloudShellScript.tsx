
import React from 'react';
import { CF_TEMPLATE_BODY, STACK_NAME } from '../constants';

interface CloudShellScriptProps {
  externalId: string;
}

export const CloudShellScript: React.FC<CloudShellScriptProps> = ({ externalId }) => {
  // Use heredoc to create the file locally in cloudshell
  const script = `
# Create the template file
cat << 'EOF' > spotsave-role.yaml
${CF_TEMPLATE_BODY}
EOF

# Create the Stack
aws cloudformation create-stack \\
  --stack-name ${STACK_NAME} \\
  --template-body file://spotsave-role.yaml \\
  --parameters ParameterKey=ExternalId,ParameterValue=${externalId} \\
  --capabilities CAPABILITY_NAMED_IAM

# Wait for creation (optional)
aws cloudformation wait stack-create-complete --stack-name ${STACK_NAME}

# Get the Role ARN
aws cloudformation describe-stacks \\
  --stack-name ${STACK_NAME} \\
  --query "Stacks[0].Outputs[?OutputKey=='RoleArn'].OutputValue" \\
  --output text
`.trim();

  return (
    <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 relative group overflow-x-auto">
      <button 
        onClick={() => navigator.clipboard.writeText(script)}
        className="absolute top-3 right-3 bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Copy
      </button>
      <pre className="whitespace-pre-wrap">{script}</pre>
    </div>
  );
};
