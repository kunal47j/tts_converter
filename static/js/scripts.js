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
    const form = this;
    const formData = new FormData(form);
    const convertBtn = document.getElementById('convertBtn');
    const btnText = convertBtn.querySelector('.btn-text');
    const audioPlayer = document.getElementById('audioPlayer');
    const downloadLink = document.getElementById('downloadLink');
    const statusRegion = document.getElementById('statusRegion');

    // UI: disable button and show spinner
    convertBtn.disabled = true;
    convertBtn.classList.add('btn-loading');
    btnText.textContent = 'Converting...';
    statusRegion.textContent = 'Converting text to speech. Please wait.';

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
        audioPlayer.src = audioURL;
        audioPlayer.style.display = 'block';
        audioPlayer.play().catch(()=>{});

        // enable download
        const filename = 'speech.mp3';
        const url = audioURL;
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = 'inline-block';

        showSuccess('Conversion complete — playing audio.');
    })
    .catch(error => {
        showError('Error converting text to speech.');
        console.error(error);
    })
    .finally(() => {
        convertBtn.disabled = false;
        convertBtn.classList.remove('btn-loading');
        btnText.textContent = 'Convert to Speech';
        statusRegion.textContent = '';
    });
});

function showError(message) {
    let msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.className = 'success-msg';
    msgDiv.style.background = '#e13b3b';
    msgDiv.style.boxShadow = '0 6px 20px rgba(225,59,59,0.2)';
    document.body.appendChild(msgDiv);
    setTimeout(() => { msgDiv.classList.add('fadeout'); }, 2400);
    setTimeout(() => { msgDiv.remove(); }, 3600);
}

