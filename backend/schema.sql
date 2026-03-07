-- Create Enum types
CREATE TYPE ride_status AS ENUM ('requested', 'accepted', 'driver_arriving', 'in_progress', 'completed', 'cancelled');
CREATE TYPE user_role AS ENUM ('customer', 'driver');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');

-- 1. Create users table
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  location JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create rides table
CREATE TABLE public.rides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.users(id) NOT NULL,
  driver_id UUID REFERENCES public.users(id),
  pickup_location JSONB NOT NULL,
  dropoff_location JSONB NOT NULL,
  vehicle_type TEXT DEFAULT 'Sedan',
  status ride_status DEFAULT 'requested' NOT NULL,
  fare NUMERIC(10, 2),
  distance_km NUMERIC(5, 2),
  pickup_time TIMESTAMP WITH TIME ZONE,
  dropoff_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create ratings table
CREATE TABLE public.ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID REFERENCES public.rides(id) NOT NULL,
  rater_id UUID REFERENCES public.users(id) NOT NULL,
  ratee_id UUID REFERENCES public.users(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create promo_codes table
CREATE TABLE public.promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_amount NUMERIC(10, 2) NOT NULL,
  type discount_type DEFAULT 'percentage' NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Realtime for the 'rides' table
ALTER PUBLICATION supabase_realtime ADD TABLE rides;

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

-- Create basic permissive policies for development
CREATE POLICY "Allow public read access to users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to rides" ON public.rides FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to rides" ON public.rides FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to rides" ON public.rides FOR UPDATE USING (true);
