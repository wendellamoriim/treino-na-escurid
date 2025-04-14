
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqniouvhwnokwkptnipa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbmlvdXZod25va3drcHRuaXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyMzUzNzcsImV4cCI6MjA1OTgxMTM3N30.7Qn7vocOEhpNEKigNFaCUnNw5NYWmhMZx2PqObAqSUE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  created_at: string;
};

export type Assessment = {
  id: string;
  client_id: string; // Alterado de clientid para client_id
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
  form_data: AssessmentFormData;
  created_at: string;
};

export interface AssessmentFormData {
  anamnesis: {
    health_issues: string;
    medications: string;
    surgeries: string;
    allergies: string;
    lifestyle: string;
    objectives: string;
    physical_activity_history: string;
    completed: boolean;
  };
  anthropometric: {
    height: number;
    weight: number;
    bmi: number;
    body_fat_percentage: number;
    waist_circumference: number;
    hip_circumference: number;
    chest_circumference: number;
    arm_circumference: number;
    thigh_circumference: number;
    calf_circumference: number;
    completed: boolean;
  };
  postural: {
    anterior_view: string;
    posterior_view: string;
    lateral_view: string;
    observations: string;
    completed: boolean;
  };
  flexibility: {
    sit_and_reach: number;
    shoulder_flexibility: number;
    trunk_rotation: number;
    observations: string;
    completed: boolean;
  };
  muscular: {
    push_ups: number;
    pull_ups: number;
    abdominal_crunches: number;
    squat_test: number;
    observations: string;
    completed: boolean;
  };
  cardiovascular: {
    resting_heart_rate: number;
    blood_pressure: string;
    cardiovascular_test: string;
    observations: string;
    completed: boolean;
  };
  completed?: boolean;
  current_step?: number;
}
