document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const trackFile = urlParams.get('track');
    const bpm = parseInt(urlParams.get('bpm'));
    const name = urlParams.get('name');

    if (!trackFile || !bpm || !name) {
        alert('Invalid track');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('track-title').textContent = name;

    const audio = new Audio(`tracks/${trackFile}`);
    const progressBar = document.getElementById('progress-bar');
    const progressTime = document.getElementById('progress-time');
    const MAX_PLAY_SECONDS = 100;
    let progressInterval = null;
    let progressStartTime = null;
    const tapButton = document.getElementById('tap-button');
    const playButton = document.getElementById('play-button');
    const stopButton = document.getElementById('stop-button');
    const scoreDisplay = document.getElementById('score-display');
    const results = document.getElementById('results');
    const finalScore = document.getElementById('final-score');
    const backButton = document.getElementById('back-button');
    const submitScoreButton = document.getElementById('submit-score-button');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const userDisplayGame = document.getElementById('user-display-game');

    const nameModal = document.getElementById('name-modal-game');
    const changeNameBtn = document.getElementById('change-name-btn-game');
    const modalClose = document.getElementById('modal-close-game');
    const cancelBtn = document.getElementById('cancel-btn-game');
    const confirmBtn = document.getElementById('confirm-btn-game');
    const nameInput = document.getElementById('new-name-input-game');

    let tapTimes = [];
    let isPlaying = false;
    let songCompleted = false;
    let currentScore = null;
    let currentAccuracy = null;
    let currentUserBpm = null;
    let turnstileToken = null;

    if (userDisplayGame) {
        const currentUser = getUserName() || 'Anonymous';
        userDisplayGame.textContent = `Player: ${currentUser}`;
    }

    function updateProgressUi(elapsedSeconds) {
        const clamped = Math.min(MAX_PLAY_SECONDS, Math.max(0, elapsedSeconds));
        const percent = (clamped / MAX_PLAY_SECONDS) * 100;
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressTime) progressTime.textContent = `${Math.floor(clamped)} / ${MAX_PLAY_SECONDS} seconds`;
    }

    function openNameModal() {
        if (!nameModal || !nameInput) return;
        nameInput.value = getUserName() || '';
        nameModal.style.display = 'flex';
        nameInput.focus();
        nameInput.select();
    }

    function closeNameModal() {
        if (!nameModal) return;
        nameModal.style.display = 'none';
    }

    function applyNewName() {
        if (!nameInput) return;
        const nextName = nameInput.value.trim();
        if (!nextName) {
            alert('Please enter a valid name.');
            return;
        }
        setUserName(nextName);
        if (userDisplayGame) {
            userDisplayGame.textContent = `Player: ${nextName}`;
        }
        closeNameModal();
    }

    if (changeNameBtn) {
        changeNameBtn.addEventListener('click', openNameModal);
    }
    if (modalClose) {
        modalClose.addEventListener('click', closeNameModal);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeNameModal);
    }
    if (confirmBtn) {
        confirmBtn.addEventListener('click', applyNewName);
    }
    if (nameInput) {
        nameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') applyNewName();
            if (event.key === 'Escape') closeNameModal();
        });
    }
    if (nameModal) {
        nameModal.addEventListener('click', (event) => {
            if (event.target === nameModal) closeNameModal();
        });
    }

    playButton.addEventListener('click', () => {
        audio.currentTime = 0;
        audio.play();
        isPlaying = true;
        songCompleted = false;
        tapTimes = [];
        scoreDisplay.textContent = 'Score: 0';
        results.style.display = 'none';
        document.getElementById('game-area').style.display = 'block';
        playButton.disabled = true;
        stopButton.disabled = false;

        updateProgressUi(0);
        progressStartTime = Date.now();
        if (progressInterval) clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            if (!isPlaying) return;
            const elapsedSeconds = (Date.now() - progressStartTime) / 1000;
            updateProgressUi(elapsedSeconds);

            if (elapsedSeconds >= MAX_PLAY_SECONDS) {
                audio.pause();
                audio.currentTime = 0;
                isPlaying = false;
                songCompleted = true;
                playButton.disabled = false;
                stopButton.disabled = true;
                clearInterval(progressInterval);
                updateProgressUi(MAX_PLAY_SECONDS);
                calculateScore();
            }
        }, 100);
    });

    stopButton.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        playButton.disabled = false;
        stopButton.disabled = true;
        scoreDisplay.textContent = 'Song paused. Click Play to try again.';
        if (progressInterval) clearInterval(progressInterval);
        updateProgressUi(0);
    });

    // When the song ends, calculate and submit the score
    audio.addEventListener('ended', () => {
        isPlaying = false;
        songCompleted = true;
        playButton.disabled = false;
        stopButton.disabled = true;
        if (progressInterval) clearInterval(progressInterval);
        updateProgressUi(MAX_PLAY_SECONDS);
        calculateScore();
    });

    tapButton.addEventListener('click', () => {
        if (isPlaying) {
            tapTimes.push(Date.now());
            updateScore();
        }
    });

    // For mobile touch
    tapButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (isPlaying) {
            tapTimes.push(Date.now());
            updateScore();
        }
    });

    function updateScore() {
        if (tapTimes.length < 2) return;
        const intervals = [];
        for (let i = 1; i < tapTimes.length; i++) {
            intervals.push((tapTimes[i] - tapTimes[i-1]) / 1000); // seconds
        }
        const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
        const userBpm = 60 / avgInterval;
        const accuracy = Math.max(0, 100 - Math.abs(bpm - userBpm));
        const totalScore = accuracy * 100;
        scoreDisplay.textContent = `Score: ${Math.round(totalScore)}`;
    }

    async function calculateScore() {
        if (tapTimes.length < 2) {
            finalScore.textContent = 'Not enough taps to calculate score.';
            document.getElementById('game-area').style.display = 'none';
            results.style.display = 'block';
        } else {
            const intervals = [];
            for (let i = 1; i < tapTimes.length; i++) {
                intervals.push((tapTimes[i] - tapTimes[i-1]) / 1000);
            }
            const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const userBpm = 60 / avgInterval;
            const accuracy = Math.max(0, 100 - Math.abs(bpm - userBpm));
            const totalScore = accuracy * 100;
            
            // Store score data for submission after Turnstile
            currentScore = Math.round(totalScore);
            currentAccuracy = Math.round(accuracy);
            currentUserBpm = Math.round(userBpm);
            
            finalScore.innerHTML = `Total Score: ${currentScore} / 10000<br>Accuracy: ${currentAccuracy}%<br>Your BPM: ${currentUserBpm}, Actual BPM: ${bpm}`;
            
            document.getElementById('game-area').style.display = 'none';
            results.style.display = 'block';
            
            // Render Turnstile widget
            renderTurnstile();
        }
    }

    function renderTurnstile() {
        const container = document.getElementById('turnstile-widget');
        if (container && window.turnstile) {
            // Clear any existing widget
            container.innerHTML = '';
            window.turnstile.render('#turnstile-widget', {
                sitekey: '0x4AAAAAACnZk3PXsNtC9t-g', // Replace with your actual site key
                theme: 'dark',
                callback: handleTurnstileSuccess,
                'error-callback': handleTurnstileError,
            });
        }
    }

    function handleTurnstileSuccess(token) {
        turnstileToken = token;
        submitScoreButton.disabled = false;
        submitScoreButton.style.backgroundColor = '#00d977';
    }

    function handleTurnstileError() {
        submitScoreButton.disabled = true;
        submitScoreButton.style.backgroundColor = '#d32f2f';
    }

    submitScoreButton.addEventListener('click', async () => {
        if (!turnstileToken) {
            alert('Please complete the verification');
            return;
        }
        
        submitScoreButton.disabled = true;
        submitScoreButton.textContent = 'Submitting...';
        
        // Save score to Supabase with Turnstile token
        const success = await saveScore(name, currentScore, currentAccuracy, currentUserBpm, bpm, turnstileToken);
        
        if (success) {
            // Fetch and display leaderboard
            const leaderboard = await getTrackLeaderboard(name, 10);
            displayLeaderboard(leaderboard);
            submitScoreButton.style.display = 'none';
        } else {
            submitScoreButton.disabled = false;
            submitScoreButton.textContent = 'Submit Score to Leaderboard';
            alert('Failed to submit score. Please try again.');
        }
    });

    function displayLeaderboard(leaderboard) {
        const leaderboardDisplay = document.getElementById('leaderboard-display');
        if (!leaderboardDisplay) return;
        
        if (leaderboard.length === 0) {
            leaderboardDisplay.innerHTML = '<p>No scores yet</p>';
            return;
        }
        
        let html = '<h3>Top Scores</h3><table class="leaderboard-table"><tr><th>Rank</th><th>Player</th><th>Score</th><th>Accuracy</th></tr>';
        leaderboard.forEach((entry, index) => {
            html += `<tr><td>${index + 1}</td><td>${entry.user_name}</td><td>${entry.score}</td><td>${entry.accuracy}%</td></tr>`;
        });
        html += '</table>';
        leaderboardDisplay.innerHTML = html;
    }

    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Prevent context menu on tap button for mobile
    tapButton.addEventListener('contextmenu', (e) => e.preventDefault());

    // Ensure progress bar is visible before playback starts.
    updateProgressUi(0);
});