/**
 * NOTE: This code runs on the Server (Node.js).
 * Included here for completeness of the solution.
 */

import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { CostExplorerClient, GetCostAndUsageCommand } from "@aws-sdk/client-cost-explorer";
import { v4 as uuidv4 } from 'uuid';

// -- Database Mock --
// In real app: import prisma from './prisma';
const db = {
  users: {
    update: async (userId: string, data: any) => { console.log(`DB Update ${userId}`, data); return true; },
    findUnique: async (userId: string) => { 
      return { id: userId, externalId: 'mock-uuid-1234', roleArn: 'arn:aws:iam::000:role/SpotSave' } 
    }
  }
};

// -- Configuration --
const REGION = "us-east-1";
const SPOTSAVE_SESSION_NAME = "SpotSaveAnalysisSession";

/**
 * 1. Generate External ID
 * Call this when a user registers or initiates connection flow
 */
export const generateUserExternalId = async (userId: string): Promise<string> => {
  const externalId = uuidv4();
  // Store securely associated with the user
  await db.users.update(userId, { externalId });
  return externalId;
};

/**
 * 2. Get Credentials via STS AssumeRole
 * This is the core security mechanism
 */
const getCrossAccountCredentials = async (roleArn: string, externalId: string) => {
  const sts = new STSClient({ region: REGION });

  try {
    const command = new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: SPOTSAVE_SESSION_NAME,
      ExternalId: externalId, // CRITICAL: This MUST match what is in the User's Trust Policy
      DurationSeconds: 3600,
    });

    const response = await sts.send(command);

    if (!response.Credentials) {
      throw new Error("Failed to assume role");
    }

    return {
      accessKeyId: response.Credentials.AccessKeyId!,
      secretAccessKey: response.Credentials.SecretAccessKey!,
      sessionToken: response.Credentials.SessionToken!,
    };
  } catch (error) {
    console.error("STS AssumeRole Error:", error);
    throw new Error("Could not connect to AWS Account. Please check permissions and External ID.");
  }
};

/**
 * 3. Analyze Costs (Example Usage)
 * This function uses the temporary credentials to fetch data
 */
export const analyzeUserCosts = async (userId: string) => {
  // A. Fetch User Config from DB
  const user = await db.users.findUnique(userId);
  if (!user || !user.roleArn || !user.externalId) {
    throw new Error("User not configured");
  }

  // B. Get Temporary Credentials
  const credentials = await getCrossAccountCredentials(user.roleArn, user.externalId);

  // C. Create Client with Temp Creds
  const ce = new CostExplorerClient({
    region: REGION,
    credentials, 
  });

  // D. Fetch Data
  const command = new GetCostAndUsageCommand({
    TimePeriod: { Start: '2023-10-01', End: '2023-11-01' },
    Granularity: 'MONTHLY',
    Metrics: ['UnblendedCost'],
  });

  const costData = await ce.send(command);
  return costData;
};
