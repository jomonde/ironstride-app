-- Create StrengthActivities table
CREATE TABLE IF NOT EXISTS strength_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  exercises JSONB NOT NULL,
  total_volume FLOAT,
  duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ExerciseLibrary table
CREATE TABLE IF NOT EXISTS exercise_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  is_template BOOLEAN DEFAULT FALSE,
  default_sets INTEGER DEFAULT 3,
  default_reps INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE strength_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_library ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own strength activities" ON strength_activities;
CREATE POLICY "Users can view their own strength activities"
  ON strength_activities FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own strength activities" ON strength_activities;
CREATE POLICY "Users can insert their own strength activities"
  ON strength_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own strength activities" ON strength_activities;
CREATE POLICY "Users can update their own strength activities"
  ON strength_activities FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own strength activities" ON strength_activities;
CREATE POLICY "Users can delete their own strength activities"
  ON strength_activities FOR DELETE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Everyone can view exercise library" ON exercise_library;
CREATE POLICY "Everyone can view exercise library"
  ON exercise_library FOR SELECT
  USING (true);

-- Enable realtime
alter publication supabase_realtime add table strength_activities;
alter publication supabase_realtime add table exercise_library;
