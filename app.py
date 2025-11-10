from flask import Flask, request, render_template, send_file, after_this_request, jsonify
import pyttsx3
import os
import uuid
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def get_voices():
    """Get available voices from the system"""
    try:
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        return [{'id': i, 'name': voice.name} for i, voice in enumerate(voices)]
    except Exception as e:
        logger.error(f"Error getting voices: {e}")
        return []

@app.route('/')
def index():
    voices = get_voices()
    return render_template('index.html', voices=voices)

@app.route('/tts', methods=['POST'])
def tts():
    try:
        text = request.form.get('text', '').strip()
        voice_id = request.form.get('voice_id')
        rate = request.form.get('rate', '200')
        
        if not text:
            return "Text is required", 400
            
        # Limit text length for performance
        if len(text) > 5000:
            return "Text is too long. Please limit to 5000 characters.", 400

        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        
        # Set voice if specified
        if voice_id and voices:
            try:
                vid = int(voice_id)
                if 0 <= vid < len(voices):
                    engine.setProperty('voice', voices[vid].id)
            except (ValueError, IndexError):
                pass  # Use default voice if invalid ID

        # Set speech rate
        try:
            rate_int = int(rate)
            if 50 <= rate_int <= 400:  # Validate rate range
                engine.setProperty('rate', rate_int)
        except ValueError:
            engine.setProperty('rate', 200)  # Default rate

        # Generate unique filename
        filename = f"output_{uuid.uuid4().hex}.mp3"
        
        # Convert text to speech
        engine.save_to_file(text, filename)
        engine.runAndWait()

        @after_this_request
        def cleanup(resp):
            try:
                if os.path.exists(filename):
                    os.remove(filename)
            except Exception as e:
                logger.error(f"Error cleaning up file {filename}: {e}")
            return resp

        # Serve audio directly for inline playback
        if os.path.exists(filename):
            return send_file(filename, mimetype="audio/mpeg")
        else:
            return "Failed to generate audio", 500
            
    except Exception as e:
        logger.error(f"Error in TTS conversion: {e}")
        return f"Error converting text to speech: {str(e)}", 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "TTS Converter"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)