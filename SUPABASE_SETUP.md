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
    turnstile_token TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_track_name ON leaderboard(track_name);
CREATE INDEX idx_score ON leaderboard(score DESC);
```

## 3. Fix Existing Table (If Already Created)

If you already created the table without the `turnstile_token` column, add it with:

```sql
ALTER TABLE leaderboard ADD COLUMN turnstile_token TEXT;
```

## 4. Enable Row Level Security (RLS)

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

## 5. Get Your Credentials

1. In the Supabase dashboard, click **Settings** (bottom left)
2. Go to **API**
3. Copy your **Project URL** and **Anon public key**

## 6. Update the Configuration

Open `js/supabase-config.js` and replace:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_PUBLIC_KEY';
```

With your actual credentials from step 5.

## 7. Deploy

Once configured, deploy your site to Cloudflare Pages. The leaderboard will automatically:
- Store player names when they first visit
- Save scores after each game (must complete full song)
- Display the top 10 scores for each track after Turnstile verification

## 8. Testing

1. Visit your site
2. Enter a player name
3. Play a track to completion
4. Complete the Turnstile challenge
5. Click "Submit Score to Leaderboard"
6. Check browser console (F12) for any errors
7. The score should appear in the leaderboard

## 9. Troubleshooting

**Error: 400 Bad Request when posting score**
- Open browser DevTools (F12) → Network tab
- Try submitting a score and look at the failed request
- Check the request body - should be JSON with track_name, user_name, score, etc.
- Verify the leaderboard table has all required columns:
  - `id` (BIGINT, auto-generated)
  - `track_name` (TEXT)
  - `user_name` (TEXT)
  - `score` (INTEGER)
  - `accuracy` (INTEGER)
  - `user_bpm` (INTEGER)
  - `actual_bpm` (INTEGER)
  - `turnstile_token` (TEXT, optional)
  - `created_at` (TIMESTAMP, auto-generated)

**Scores not saving:**
- Check browser console for error messages
- Verify RLS policies are enabled and allow INSERT
- Confirm Supabase credentials in `js/supabase-config.js` are correct
- Check that Row Level Security policies don't have conflicting rules
