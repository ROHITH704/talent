/*
  # Talent Discovery and Booking Platform Schema

  ## Overview
  Complete database schema for connecting performers with customers for event bookings.

  ## New Tables

  ### 1. profiles
  Extended user information linked to auth.users
  - `id` (uuid, FK to auth.users) - User ID
  - `email` (text) - User email
  - `full_name` (text) - Full name
  - `user_type` (text) - Type: 'performer' or 'customer'
  - `phone` (text) - Contact number
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. performer_profiles
  Detailed performer information
  - `id` (uuid, PK) - Profile ID
  - `user_id` (uuid, FK to profiles) - Reference to user
  - `stage_name` (text) - Professional/stage name
  - `bio` (text) - Performer biography
  - `experience_years` (integer) - Years of experience
  - `base_price` (decimal) - Starting price for bookings
  - `location_city` (text) - City location
  - `location_state` (text) - State location
  - `video_reel_url` (text) - Main showcase video URL
  - `popularity_score` (integer) - Calculated popularity metric
  - `total_bookings` (integer) - Total completed bookings
  - `average_rating` (decimal) - Average customer rating
  - `is_verified` (boolean) - Verification status
  - `is_available` (boolean) - Availability status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. categories
  Talent categories (dancer, singer, magician, etc.)
  - `id` (uuid, PK) - Category ID
  - `name` (text) - Category name
  - `description` (text) - Category description
  - `icon` (text) - Icon identifier
  - `created_at` (timestamptz)

  ### 4. performer_categories
  Many-to-many relationship between performers and categories
  - `id` (uuid, PK)
  - `performer_id` (uuid, FK to performer_profiles)
  - `category_id` (uuid, FK to categories)
  - `created_at` (timestamptz)

  ### 5. demo_videos
  Demo videos uploaded by performers
  - `id` (uuid, PK) - Video ID
  - `performer_id` (uuid, FK to performer_profiles)
  - `title` (text) - Video title
  - `description` (text) - Video description
  - `video_url` (text) - Video file URL
  - `thumbnail_url` (text) - Thumbnail image URL
  - `duration_seconds` (integer) - Video duration
  - `view_count` (integer) - Number of views
  - `created_at` (timestamptz)

  ### 6. hashtags
  Searchable hashtags
  - `id` (uuid, PK) - Hashtag ID
  - `name` (text, unique) - Hashtag name (without #)
  - `usage_count` (integer) - Number of times used
  - `created_at` (timestamptz)

  ### 7. performer_hashtags
  Many-to-many relationship between performers and hashtags
  - `id` (uuid, PK)
  - `performer_id` (uuid, FK to performer_profiles)
  - `hashtag_id` (uuid, FK to hashtags)
  - `created_at` (timestamptz)

  ### 8. bookings
  Booking records between customers and performers
  - `id` (uuid, PK) - Booking ID
  - `customer_id` (uuid, FK to profiles)
  - `performer_id` (uuid, FK to performer_profiles)
  - `event_date` (date) - Date of event
  - `event_time` (time) - Time of event
  - `event_duration_hours` (decimal) - Duration in hours
  - `event_type` (text) - Type of event (wedding, birthday, corporate, etc.)
  - `event_location` (text) - Event venue/address
  - `event_city` (text) - Event city
  - `event_state` (text) - Event state
  - `total_amount` (decimal) - Total booking amount
  - `status` (text) - Status: 'pending', 'confirmed', 'completed', 'cancelled'
  - `special_requirements` (text) - Additional requirements
  - `customer_notes` (text) - Notes from customer
  - `performer_notes` (text) - Notes from performer
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 9. reviews
  Customer reviews for performers
  - `id` (uuid, PK) - Review ID
  - `booking_id` (uuid, FK to bookings)
  - `customer_id` (uuid, FK to profiles)
  - `performer_id` (uuid, FK to performer_profiles)
  - `rating` (integer) - Rating 1-5
  - `review_text` (text) - Review content
  - `created_at` (timestamptz)

  ### 10. payments
  Payment records for bookings
  - `id` (uuid, PK) - Payment ID
  - `booking_id` (uuid, FK to bookings)
  - `amount` (decimal) - Payment amount
  - `payment_method` (text) - Payment method used
  - `payment_status` (text) - Status: 'pending', 'completed', 'failed', 'refunded'
  - `transaction_id` (text) - External transaction reference
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Policies for authenticated users based on user_type and ownership
  - Public read access for performer discovery
  - Strict write access based on user roles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('performer', 'customer')),
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create performer_profiles table
CREATE TABLE IF NOT EXISTS performer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stage_name text NOT NULL,
  bio text,
  experience_years integer DEFAULT 0,
  base_price decimal(10, 2) DEFAULT 0,
  location_city text,
  location_state text,
  video_reel_url text,
  popularity_score integer DEFAULT 0,
  total_bookings integer DEFAULT 0,
  average_rating decimal(3, 2) DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create performer_categories junction table
CREATE TABLE IF NOT EXISTS performer_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id uuid NOT NULL REFERENCES performer_profiles(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(performer_id, category_id)
);

-- Create demo_videos table
CREATE TABLE IF NOT EXISTS demo_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id uuid NOT NULL REFERENCES performer_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  duration_seconds integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create hashtags table
CREATE TABLE IF NOT EXISTS hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create performer_hashtags junction table
CREATE TABLE IF NOT EXISTS performer_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  performer_id uuid NOT NULL REFERENCES performer_profiles(id) ON DELETE CASCADE,
  hashtag_id uuid NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(performer_id, hashtag_id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  performer_id uuid NOT NULL REFERENCES performer_profiles(id) ON DELETE CASCADE,
  event_date date NOT NULL,
  event_time time NOT NULL,
  event_duration_hours decimal(4, 2) NOT NULL,
  event_type text NOT NULL,
  event_location text NOT NULL,
  event_city text NOT NULL,
  event_state text NOT NULL,
  total_amount decimal(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  special_requirements text,
  customer_notes text,
  performer_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  performer_id uuid NOT NULL REFERENCES performer_profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount decimal(10, 2) NOT NULL,
  payment_method text,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_performer_profiles_user_id ON performer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_performer_profiles_location ON performer_profiles(location_city, location_state);
CREATE INDEX IF NOT EXISTS idx_performer_profiles_popularity ON performer_profiles(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_demo_videos_performer_id ON demo_videos(performer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_performer_id ON bookings(performer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_performer_id ON reviews(performer_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE performer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE performer_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE performer_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for performer_profiles
CREATE POLICY "Anyone can view performer profiles"
  ON performer_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Performers can update own profile"
  ON performer_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Performers can insert own profile"
  ON performer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for categories (read-only for users)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for performer_categories
CREATE POLICY "Anyone can view performer categories"
  ON performer_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Performers can manage own categories"
  ON performer_categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM performer_profiles
      WHERE performer_profiles.id = performer_id
      AND performer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Performers can delete own categories"
  ON performer_categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM performer_profiles
      WHERE performer_profiles.id = performer_id
      AND performer_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for demo_videos
CREATE POLICY "Anyone can view demo videos"
  ON demo_videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Performers can insert own videos"
  ON demo_videos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM performer_profiles
      WHERE performer_profiles.id = performer_id
      AND performer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Performers can update own videos"
  ON demo_videos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM performer_profiles
      WHERE performer_profiles.id = performer_id
      AND performer_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM performer_profiles
      WHERE performer_profiles.id = performer_id
      AND performer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Performers can delete own videos"
  ON demo_videos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM performer_profiles
      WHERE performer_profiles.id = performer_id
      AND performer_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for hashtags
CREATE POLICY "Anyone can view hashtags"
  ON hashtags FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for performer_hashtags
CREATE POLICY "Anyone can view performer hashtags"
  ON performer_hashtags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Performers can manage own hashtags"
  ON performer_hashtags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM performer_profiles
      WHERE performer_profiles.id = performer_id
      AND performer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Performers can delete own hashtags"
  ON performer_hashtags FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM performer_profiles
      WHERE performer_profiles.id = performer_id
      AND performer_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM performer_profiles
      WHERE performer_profiles.id = bookings.performer_id
      AND performer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM performer_profiles
      WHERE performer_profiles.id = bookings.performer_id
      AND performer_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM performer_profiles
      WHERE performer_profiles.id = bookings.performer_id
      AND performer_profiles.user_id = auth.uid()
    )
  );

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customers can create reviews for own bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.customer_id = auth.uid()
      AND bookings.status = 'completed'
    )
  );

-- RLS Policies for payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = payments.booking_id
      AND (
        bookings.customer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM performer_profiles
          WHERE performer_profiles.id = bookings.performer_id
          AND performer_profiles.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "System can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_id
      AND bookings.customer_id = auth.uid()
    )
  );

-- Insert default categories
INSERT INTO categories (name, description, icon) VALUES
  ('Dancer', 'Professional dancers specializing in various dance forms', 'music'),
  ('Singer', 'Vocalists and musical performers', 'mic'),
  ('Magician', 'Illusionists and magic performers', 'wand-sparkles'),
  ('DJ', 'Disc jockeys and music mixers', 'disc'),
  ('Band', 'Musical bands and groups', 'users'),
  ('Comedian', 'Stand-up comedians and humor artists', 'laugh'),
  ('Artist', 'Visual artists and painters', 'palette'),
  ('Photographer', 'Event and portrait photographers', 'camera'),
  ('Anchor/Host', 'Event hosts and emcees', 'mic-2')
ON CONFLICT (name) DO NOTHING;
