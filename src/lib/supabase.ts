
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqniouvhwnokwkptnipa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbmlvdXZod25va3drcHRuaXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzUzNzcsImV4cCI6MjA1OTgxMTM3N30.7Qn7vocOEhpNEKigNFaCUnNw5NYWmhMZx2PqObAqIEA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  created_at: string;
  avatar_url?: string;
};

export type Assessment = {
  id: string;
  clientid: string;
  date: string;
  type: string;
  status: string;
  created_at: string;
};

export type Report = {
  id: string;
  assessment_id: string;
  date: string;
  status: string;
  created_at: string;
};

export type AssessmentDetails = {
  id: string;
  assessment_id: string;
  form_data: any;
  created_at: string;
};
