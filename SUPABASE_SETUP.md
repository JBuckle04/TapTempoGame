# Supabase Leaderboard Setup Guide

Follow these steps to set up the leaderboard feature with Supabase:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Fill in the project details and create the project
4. Wait for the project to be initialized

## 2. Create the Leaderboard Table

In your Supabase dashboard, go to the SQL Editor and run the following SQL to create the leaderboard table:

```sql
CREATE TABLE leaderboard (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    track_name TEXT NOT NULL,
    user_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    accuracy INTEGER NOT NULL,
    user_bpm INTEGER,
    actual_bpm INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create an index for faster queries
CREATE INDEX idx_track_name ON leaderboard(track_name);
CREATE INDEX idx_score ON leaderboard(score DESC);
```

## 3. Enable Row Level Security (RLS)

In the Supabase dashboard:
1. Go to **Authentication** → **Policies**
2. Select the `leaderboard` table
3. Create public policies to allow:
   - **SELECT**: Allows anyone to read scores
   - **INSERT**: Allows anyone to insert scores

Or use this SQL:

```sql
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
  ON leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON leaderboard FOR INSERT
  WITH CHECK (true);
```

## 4. Get Your Credentials

1. In the Supabase dashboard, click **Settings** (bottom left)
2. Go to **API**
3. Copy your **Project URL** and **Anon public key**

## 5. Update the Configuration

Open `js/supabase-config.js` and replace:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';
```

With your actual credentials from step 4.

## 6. Deploy

Once configured, deploy your site to Cloudflare Pages. The leaderboard will automatically:
- Store player names when they first visit
- Save scores after each game
- Display the top 10 scores for each track

## Testing

1. Visit your site
2. Enter a player name
3. Play a track
4. The score should appear in the leaderboard
5. Go back and check the leaderboard in the results screen
