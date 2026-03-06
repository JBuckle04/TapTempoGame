document.addEventListener('DOMContentLoaded', function() {
    fetch('tracks.json')
        .then(response => response.json())
        .then(tracks => {
            const trackList = document.getElementById('track-list');
            tracks.forEach(track => {
                const button = document.createElement('button');
                button.className = 'track-button';
                button.textContent = track.name;
                button.addEventListener('click', () => {
                    window.location.href = `game.html?track=${encodeURIComponent(track.file)}&bpm=${track.bpm}&name=${encodeURIComponent(track.name)}`;
                });
                trackList.appendChild(button);
            });
        })
        .catch(error => console.error('Error loading tracks:', error));
});