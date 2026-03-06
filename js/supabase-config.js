// Supabase Configuration
// Replace these with your actual Supabase project credentials

const SUPABASE_URL = 'https://thlpnajijtvgsqddfvdx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TZpGVQRVIim245qRXzNiEw_cMhXHGqy';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Local storage key for user name
const USER_NAME_KEY = 'tapTempoUserName';

// Get stored user name or null
function getUserName() {
    return localStorage.getItem(USER_NAME_KEY);
}

// Store user name
function setUserName(name) {
    localStorage.setItem(USER_NAME_KEY, name);
}

// Save score to Supabase
async function saveScore(trackName, score, accuracy, userBpm, actualBpm, turnstileToken) {
    const userName = getUserName();
    if (!userName) {
        console.error('No user name set');
        return false;
    }

    try {
        const { data, error } = await supabaseClient
            .from('leaderboard')
            .insert([
                {
                    track_name: trackName,
                    user_name: userName,
                    score: score,
                    accuracy: accuracy,
                    user_bpm: userBpm,
                    actual_bpm: actualBpm,
                    turnstile_token: turnstileToken,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error('Error saving score:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error saving score:', error);
        return false;
    }
}

// Get leaderboard for a specific track
async function getTrackLeaderboard(trackName, limit = 10) {
    try {
        const { data, error } = await supabaseClient
            .from('leaderboard')
            .select('*')
            .eq('track_name', trackName)
            .order('score', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
}
