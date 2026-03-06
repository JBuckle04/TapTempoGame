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
    const tapButton = document.getElementById('tap-button');
    const playButton = document.getElementById('play-button');
    const stopButton = document.getElementById('stop-button');
    const scoreDisplay = document.getElementById('score-display');
    const results = document.getElementById('results');
    const finalScore = document.getElementById('final-score');
    const backButton = document.getElementById('back-button');

    let tapTimes = [];
    let isPlaying = false;

    playButton.addEventListener('click', () => {
        audio.play();
        isPlaying = true;
        tapTimes = [];
        scoreDisplay.textContent = 'Score: 0';
        results.style.display = 'none';
        document.getElementById('game-area').style.display = 'block';
    });

    stopButton.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
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

    function calculateScore() {
        if (tapTimes.length < 2) {
            finalScore.textContent = 'Not enough taps to calculate score.';
        } else {
            const intervals = [];
            for (let i = 1; i < tapTimes.length; i++) {
                intervals.push((tapTimes[i] - tapTimes[i-1]) / 1000);
            }
            const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const userBpm = 60 / avgInterval;
            const accuracy = Math.max(0, 100 - Math.abs(bpm - userBpm));
            const totalScore = accuracy * 100;
            finalScore.innerHTML = `Total Score: ${Math.round(totalScore)} / 10000<br>Accuracy: ${Math.round(accuracy)}%<br>Your BPM: ${Math.round(userBpm)}, Actual BPM: ${bpm}`;
        }
        document.getElementById('game-area').style.display = 'none';
        results.style.display = 'block';
    }

    backButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Prevent context menu on tap button for mobile
    tapButton.addEventListener('contextmenu', (e) => e.preventDefault());
});