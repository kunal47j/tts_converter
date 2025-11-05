function showSuccess(message) {
    let msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.className = "success-msg";
    document.body.appendChild(msgDiv);
    setTimeout(() => { msgDiv.classList.add('fadeout'); }, 1800);
    setTimeout(() => { msgDiv.remove(); }, 3000);
}

document.getElementById('ttsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showSuccess('Speech conversion in progress...');
    const formData = new FormData(this);

    fetch('/tts', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
    })
    .then(blob => {
        const audioURL = URL.createObjectURL(blob);
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = audioURL;
        audioPlayer.style.display = 'block';
        audioPlayer.play();
    })
    .catch(error => {
        alert('Error converting text to speech.');
        console.error(error);
    });
});

