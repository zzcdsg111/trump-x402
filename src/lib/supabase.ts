import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Transaction {
  id: string;
  tx_hash: string;
  from_address: string;
  to_address: string;
  amount: number;
  token: string;
  chain: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  resource_id?: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  access_count: number;
  created_at: string;
  content_url?: string;
}

export interface PaymentRecord {
  id: string;
  user_address: string;
  resource_id: string;
  transaction_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'expired';
  expires_at: string;
  created_at: string;
}
