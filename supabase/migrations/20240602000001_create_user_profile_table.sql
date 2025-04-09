-- Create user profile table to store user preferences and settings
CREATE TABLE IF NOT EXISTS user_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  age INT,
  weight DECIMAL,
  fitness_goal TEXT,
  training_focus TEXT,
  hr_max INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create zone profile table to store heart rate zones
CREATE TABLE IF NOT EXISTS zone_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  zone1_min INT,
  zone1_max INT,
  zone2_min INT,
  zone2_max INT,
  zone3_min INT,
  zone3_max INT,
  zone4_min INT,
  zone4_max INT,
  zone5_min INT,
  zone5_max INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activities table for cardio workouts
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  type TEXT,
  distance DECIMAL,
  duration INT,
  avg_pace TEXT,
  avg_heart_rate INT,
  route_data JSONB,
  heart_rate_data JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for all tables
alter publication supabase_realtime add table user_profile;
alter publication supabase_realtime add table zone_profile;
alter publication supabase_realtime add table activities;
