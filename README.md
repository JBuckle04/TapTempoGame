# Tap Tempo Game

A web-based game where players tap along to the beat of songs to score points based on tempo accuracy.

## Features

- Choose from a list of tracks
- Play the track and tap a button to match the tempo
- Real-time score calculation
- Mobile-optimized interface
- Static hosting ready for Cloudflare Pages

## Setup

1. Place your audio files (MP3, etc.) in the `tracks/` directory.
2. Update `tracks.json` with your track information:
   ```json
   [
       {
           "name": "Song Title",
           "file": "filename.mp3",
           "bpm": 120
       }
   ]
   ```
3. Deploy to Cloudflare Pages or any static host.

## How to Play

1. Select a track from the main page.
2. Click "Play Track" to start the music.
3. Tap the green button in time with the beat.
4. Click "Stop" to see your score.
5. Your score is based on how close your tapping tempo matches the song's BPM.

## Development

- `index.html`: Track selection page
- `game.html`: Game interface
- `css/styles.css`: Styles, mobile-responsive
- `js/app.js`: Track loading and navigation
- `js/game.js`: Game logic and scoring

## Deployment

Upload all files to Cloudflare Pages. Ensure audio files are in `tracks/` and accessible.