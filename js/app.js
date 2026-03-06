document.addEventListener('DOMContentLoaded', function() {
    const userDisplay = document.getElementById('user-display');
    const changeNameBtn = document.getElementById('change-name-btn');
    const nameModal = document.getElementById('name-modal');
    const modalClose = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('cancel-btn');
    const confirmBtn = document.getElementById('confirm-btn');
    const newNameInput = document.getElementById('new-name-input');

    function updateUserDisplay(name) {
        if (userDisplay) {
            userDisplay.textContent = `Player: ${name}`;
        }
    }

    function openNameModal() {
        if (!nameModal || !newNameInput) return;
        newNameInput.value = getUserName() || '';
        nameModal.style.display = 'flex';
        newNameInput.focus();
        newNameInput.select();
    }

    function closeNameModal() {
        if (!nameModal) return;
        nameModal.style.display = 'none';
    }

    function applyNameChange() {
        if (!newNameInput) return;
        const nextName = newNameInput.value.trim();
        if (!nextName) {
            alert('Please enter a valid name.');
            return;
        }
        setUserName(nextName);
        updateUserDisplay(nextName);
        closeNameModal();
    }

    // Check if user name is already set
    let userName = getUserName();
    
    if (!userName) {
        // Prompt for user name
        userName = prompt('Enter your name:');
        if (!userName || userName.trim() === '') {
            userName = 'Anonymous';
        }
        setUserName(userName);
    }

    updateUserDisplay(userName);

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
        confirmBtn.addEventListener('click', applyNameChange);
    }
    if (newNameInput) {
        newNameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') applyNameChange();
            if (event.key === 'Escape') closeNameModal();
        });
    }
    if (nameModal) {
        nameModal.addEventListener('click', (event) => {
            if (event.target === nameModal) closeNameModal();
        });
    }
    
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