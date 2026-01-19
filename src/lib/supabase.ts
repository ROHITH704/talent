import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  user_type: 'performer' | 'customer';
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PerformerProfile = {
  id: string;
  user_id: string;
  stage_name: string;
  bio: string | null;
  experience_years: number;
  base_price: number;
  location_city: string | null;
  location_state: string | null;
  video_reel_url: string | null;
  popularity_score: number;
  total_bookings: number;
  average_rating: number;
  is_verified: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
};

export type DemoVideo = {
  id: string;
  performer_id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  duration_seconds: number;
  view_count: number;
  created_at: string;
};

export type Booking = {
  id: string;
  customer_id: string;
  performer_id: string;
  event_date: string;
  event_time: string;
  event_duration_hours: number;
  event_type: string;
  event_location: string;
  event_city: string;
  event_state: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  special_requirements: string | null;
  customer_notes: string | null;
  performer_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  booking_id: string;
  customer_id: string;
  performer_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
};
