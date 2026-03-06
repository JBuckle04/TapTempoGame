# Cloudflare Turnstile CAPTCHA Setup Guide

This game uses Cloudflare Turnstile to prevent abuse via browser console manipulation of scores.

## 1. Create a Turnstile Site

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click on your account in the top right
3. Go to **Turnstile** in the sidebar
4. Click **Create Site**
5. Fill in the details:
   - **Site Name**: "Tap Tempo Game" (or your preferred name)
   - **Domains**: Add your site's domain(s) (e.g., `taptempo.pages.dev`, `yourdomain.com`)
   - **Mode**: Select "Manage" mode (recommended)
6. Click **Create**

## 2. Get Your Site Key

After creating the site, you'll see:
- **Site Key** (public, safe to use in client code)
- **Secret Key** (keep private, only use in backend)

## 3. Update Your Configuration

### Client-Side (js/game.js)

Find this line in `js/game.js`:
```javascript
sitekey: 'YOUR_TURNSTILE_SITE_KEY', // Replace with your actual site key
```

Replace `YOUR_TURNSTILE_SITE_KEY` with the Site Key from step 2.

Example:
```javascript
sitekey: 'YOUR_SITE_KEY_HERE',
```

### Server-Side (Optional - For Enhanced Security)

For production, you should verify the Turnstile token server-side. Create a Supabase Edge Function that:
1. Receives the token from your client
2. Sends it to Cloudflare's verification endpoint
3. Checks the response before allowing the score to be saved

This prevents anyone from forging responses or bypassing the CAPTCHA entirely.

## 4. Testing

1. Play a game and complete the song
2. You should see the Turnstile challenge widget
3. Complete the challenge
4. The "Submit Score to Leaderboard" button should become enabled
5. Click it to submit your score

## Security Notes

- The Site Key is public and meant to be in client code
- **Never** share your Secret Key
- For production, implement server-side verification using Supabase Edge Functions
- The Turnstile token is stored with each score for audit purposes

## Cloudflare Dashboard Management

You can manage your Turnstile sites from:
- Dashboard → Turnstile → Your Site Name
- View analytics, manage domains, rotate keys
