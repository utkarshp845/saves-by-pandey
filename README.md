# Saves by Pandey Solutions

**Saves** is a secure, read-only cloud cost optimization tool for AWS. It helps users identify wasted spend (idle EC2, unattached EBS, etc.) without requiring access keys.

## Features

- **Bank-Grade Security**: Uses AWS STS `AssumeRole` with an External ID. No permanent keys stored.
- **Interactive Dashboard**: Visualizes cost savings and optimization opportunities.
- **One-Click Connection**: Automates role creation via CloudFormation.
- **Client-Side SPA**: Built with React, TypeScript, and Tailwind CSS.

## Getting Started

1. **Clone the repo**
2. **Serve the app**: Since this uses ES Modules via `esm.sh`, you just need a static file server.
   ```bash
   npx serve .
   ```
3. **Open** `http://localhost:3000`

## Architecture

- **Frontend**: React (ESM), Recharts, Tailwind CSS.
- **Infrastructure**: AWS CloudFormation (YAML) for secure role provisioning.
- **Logic**: AWS SDK v3 for JavaScript (Cost Explorer, STS).

## Security

This tool requests **ReadOnly** access only. It cannot modify resources.
- See `infrastructure/cloudformation.yaml` for the exact permissions.
- See `components/SecurityExplanation.tsx` for the trust model.

## License

MIT
