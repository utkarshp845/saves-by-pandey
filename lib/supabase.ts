import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a dummy client if env vars are missing (for development)
const createDummyClient = () => {
  return {
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
      update: () => ({ eq: async () => ({ error: { message: 'Supabase not configured' } }) }),
    }),
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDummyClient();

// Database types
export interface User {
  id: string;
  external_id: string;
  role_arn?: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  external_id: string;
  role_arn?: string;
  created_at: string;
  updated_at: string;
}

// Helper functions for safe localStorage access
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn('localStorage access failed:', e);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('localStorage set failed:', e);
  }
};

// Database helper functions
export const db = {
  // Create or get a user session
  async createOrGetSession(): Promise<{ externalId: string; sessionId: string }> {
    // If Supabase is not configured, use localStorage fallback
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, using localStorage fallback');
      let externalId = safeGetItem('spotsave_external_id');
      let sessionId = safeGetItem('spotsave_session_id');
      
      if (!externalId || !sessionId) {
        externalId = crypto.randomUUID();
        sessionId = crypto.randomUUID();
        safeSetItem('spotsave_external_id', externalId);
        safeSetItem('spotsave_session_id', sessionId);
      }
      
      return { externalId, sessionId };
    }

    // Check if there's an existing session in localStorage
    const existingSessionId = safeGetItem('spotsave_session_id');
    
    if (existingSessionId) {
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select('external_id, id')
          .eq('id', existingSessionId)
          .single();
        
        if (data && !error) {
          return { externalId: data.external_id, sessionId: data.id };
        }
      } catch (err) {
        console.warn('Failed to retrieve existing session:', err);
        // Fall through to create new session
      }
    }

    // Create new session
    try {
      const externalId = crypto.randomUUID();
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          external_id: externalId,
        })
        .select()
        .single();

      if (error || !data) {
        // If database insert fails, fall back to localStorage
        console.warn('Database insert failed, using localStorage:', error?.message);
        const fallbackSessionId = crypto.randomUUID();
        localStorage.setItem('spotsave_external_id', externalId);
        localStorage.setItem('spotsave_session_id', fallbackSessionId);
        return { externalId, sessionId: fallbackSessionId };
      }

      // Store session ID in localStorage
      safeSetItem('spotsave_session_id', data.id);
      
      return { externalId: data.external_id, sessionId: data.id };
    } catch (err) {
      // Complete fallback to localStorage if everything fails
      console.warn('Session creation failed, using localStorage fallback:', err);
      const externalId = crypto.randomUUID();
      const sessionId = crypto.randomUUID();
      safeSetItem('spotsave_external_id', externalId);
      safeSetItem('spotsave_session_id', sessionId);
      return { externalId, sessionId };
    }
  },

  // Update session with role ARN
  async updateSessionRole(sessionId: string, roleArn: string): Promise<void> {
    // If Supabase is not configured, just store in localStorage
    if (!supabaseUrl || !supabaseAnonKey) {
      safeSetItem('spotsave_role_arn', roleArn);
      return;
    }

    try {
      const { error } = await supabase
        .from('sessions')
        .update({ role_arn: roleArn })
        .eq('id', sessionId);

      if (error) {
        console.warn('Failed to update session in database:', error.message);
        // Fallback to localStorage
        safeSetItem('spotsave_role_arn', roleArn);
      }
    } catch (err) {
      console.warn('Error updating session:', err);
      // Fallback to localStorage
      safeSetItem('spotsave_role_arn', roleArn);
    }
  },

  // Get session by ID
  async getSession(sessionId: string): Promise<Session | null> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Session;
  },
};

