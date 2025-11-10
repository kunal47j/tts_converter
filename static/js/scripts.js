// Update slider value display
document.getElementById('rate').addEventListener('input', function() {
    document.getElementById('rateValue').textContent = this.value;
});

// Update character count
document.getElementById('text').addEventListener('input', function() {
    document.getElementById('charCount').textContent = this.value.length;
});

function showSuccess(message) {
    // Remove any existing messages
    document.querySelectorAll('.success-msg').forEach(el => el.remove());
    
    let msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.className = "success-msg";
    document.body.appendChild(msgDiv);
    setTimeout(() => { msgDiv.classList.add('fadeout'); }, 1800);
    setTimeout(() => { msgDiv.remove(); }, 3000);
}

function showError(message) {
    // Remove any existing messages
    document.querySelectorAll('.error-msg').forEach(el => el.remove());
    
    let msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.className = 'error-msg';
    document.body.appendChild(msgDiv);
    setTimeout(() => { msgDiv.classList.add('fadeout'); }, 2400);
    setTimeout(() => { msgDiv.remove(); }, 3600);
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
    
    // Show loading state for audio player
    audioPlayer.style.display = 'none';

    fetch('/tts', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text || 'Network response was not ok'); });
        }
        return response.blob();
    })
    .then(blob => {
        const audioURL = URL.createObjectURL(blob);
        audioPlayer.src = audioURL;
        audioPlayer.style.display = 'block';
        
        // Play audio automatically
        audioPlayer.play().catch(error => {
            console.warn('Auto-play prevented:', error);
            showSuccess('Conversion complete! Click play to listen.');
        });

        // Enable download
        const filename = 'speech-' + new Date().getTime() + '.mp3';
        downloadLink.href = audioURL;
        downloadLink.download = filename;
        downloadLink.style.display = 'inline-block';
        downloadLink.textContent = 'Download audio (' + formatFileSize(blob.size) + ')';

        showSuccess('Conversion successful! Playing audio...');
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Error: ' + (error.message || 'Failed to convert text to speech.'));
    })
    .finally(() => {
        convertBtn.disabled = false;
        convertBtn.classList.remove('btn-loading');
        btnText.textContent = 'Convert to Speech';
        statusRegion.textContent = '';
    });
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}