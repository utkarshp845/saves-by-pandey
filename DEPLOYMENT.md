# Deployment Guide for SpotSave

This guide will help you deploy SpotSave to AWS Amplify with Supabase PostgreSQL database and configure a custom domain via Route53.

## Prerequisites

1. AWS Account with appropriate permissions
2. Supabase account (free tier works)
3. Domain `saves.pandeylabs.com` already registered in Route53

## Step 1: Set Up Supabase Database

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Note down your project URL and anon key from Settings > API

2. **Run Database Schema**
   - In Supabase Dashboard, go to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL to create the `sessions` table

3. **Configure Row Level Security (RLS)**
   - The schema already includes RLS policies
   - Verify in Authentication > Policies that the policy is active

## Step 2: Deploy to AWS Amplify

### Option A: Deploy via AWS Console

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" > "Host web app"
   - Connect your Git repository (GitHub, GitLab, Bitbucket, or deploy without Git)
   - Select your repository and branch

2. **Configure Build Settings**
   - Amplify will auto-detect the `amplify.yml` file
   - If not detected, use these build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
     ```

3. **Set Environment Variables**
   - In Amplify Console, go to App settings > Environment variables
   - Add the following (you'll need to set these):
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Save and redeploy
   - **Note**: Make sure to set these before the first deployment, or the app will fall back to dummy database functions

4. **Deploy**
   - Click "Save and deploy"
   - Wait for the build to complete

### Option B: Deploy via AWS CLI

```bash
# Install Amplify CLI if not already installed
npm install -g @aws-amplify/cli

# Initialize Amplify (if not already done)
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

## Step 3: Configure Custom Domain (Route53)

1. **In AWS Amplify Console**
   - Go to your app
   - Navigate to "Domain management" in the left sidebar
   - Click "Add domain"

2. **Add Your Domain**
   - Enter `saves.pandeylabs.com`
   - Click "Configure domain"

3. **Verify Domain Ownership**
   - If this is your first time using this domain with Amplify, you may need to verify ownership
   - Follow the verification steps provided

4. **Configure DNS in Route53**
   - Amplify will provide you with DNS records (CNAME or A/AAAA records)
   - Go to Route53 Console > Hosted zones > pandeylabs.com
   - Create a new record:
     - **Record name**: `saves`
     - **Record type**: CNAME (or A/AAAA as provided by Amplify)
     - **Value**: The Amplify domain provided (e.g., `d1234567890.cloudfront.net`)
     - **TTL**: 300 (or use Route53 alias if A/AAAA record)

5. **Wait for DNS Propagation**
   - DNS changes can take a few minutes to propagate
   - Verify using: `dig saves.pandeylabs.com` or `nslookup saves.pandeylabs.com`

6. **SSL Certificate**
   - Amplify automatically provisions SSL certificates via AWS Certificate Manager
   - This usually takes 30-60 minutes
   - Your site will be available at `https://saves.pandeylabs.com` once complete

## Step 4: Verify Deployment

1. **Test the Application**
   - Visit `https://saves.pandeylabs.com`
   - Test the connection wizard
   - Verify that sessions are being created in Supabase

2. **Check Supabase**
   - Go to Supabase Dashboard > Table Editor
   - Verify that new sessions are being created when users visit the site

3. **Monitor Logs**
   - In Amplify Console, check Build logs and Runtime logs for any errors
   - In Supabase, check Logs for database queries

## Troubleshooting

### Build Failures
- Check that all dependencies are in `package.json`
- Verify `amplify.yml` is correct
- Check build logs in Amplify Console

### Database Connection Issues
- Verify environment variables are set correctly in Amplify
- Check Supabase RLS policies allow anonymous access
- Verify Supabase project is active and not paused

### DNS Issues
- Verify Route53 records are correct
- Check DNS propagation: `dig saves.pandeylabs.com`
- Ensure TTL is not too high (300 seconds recommended)

### SSL Certificate Issues
- Wait for certificate provisioning (can take up to 1 hour)
- Check Certificate Manager in AWS Console
- Verify domain ownership if certificate fails

## Environment Variables Reference

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `VITE_SUPABASE_URL` | Supabase project URL | Supabase Dashboard > Settings > API > Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase Dashboard > Settings > API > anon/public key |

## Additional Notes

- The app uses client-side Supabase integration, so all database operations happen from the browser
- For production, consider implementing proper authentication
- The current RLS policy allows all operations - you may want to restrict this based on your security requirements
- Old sessions are automatically cleaned up after 30 days (via the cleanup function in schema.sql)

## Support

For issues or questions:
1. Check AWS Amplify documentation
2. Check Supabase documentation
3. Review application logs in both services

