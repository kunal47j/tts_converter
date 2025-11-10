# Text to Speech Converter

A modern web application that converts text to speech using Python and Flask.

## Features

- Convert any text to speech
- Choose from multiple available voices
- Adjustable speech speed
- Download generated audio files
- Responsive and attractive UI
- Real-time audio playback

## Installation

1. Clone the repository
2. Install the required packages:
   ```
   pip install -r requirements.txt
   ```
3. Run the application:
   ```
   python app.py
   ```
4. Open your browser and go to `http://localhost:5000`

## Usage

1. Enter the text you want to convert to speech
2. Select a voice from the dropdown (if available)
3. Adjust the speech speed using the slider
4. Click "Convert to Speech"
5. Listen to the generated audio
6. Download the audio file if needed

## Requirements

- Python 3.6+
- Flask
- pyttsx3
- Other dependencies listed in requirements.txt

## Project Structure

```
TTS_converter/
│
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── README.md           # This file
├── templates/
│   └── index.html      # Main HTML template
└── static/
    ├── css/
    │   └── styles.css  # Styling
    └── js/
        └── scripts.js  # Client-side JavaScript
```

## API Endpoints

- `GET /` - Serve the main page
- `POST /tts` - Convert text to speech and return audio file

## License

This project is open source and available under the MIT License.