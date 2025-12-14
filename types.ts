export interface UserSession {
  id: string;
  name: string;
  externalId: string; // The unique ID generated for this user
}

export interface AwsAccountConfig {
  roleArn: string;
  isValid: boolean;
}

export enum ConnectionStep {
  GENERATE_ID = 0,
  LAUNCH_STACK = 1,
  INPUT_ARN = 2,
  SUCCESS = 3
}