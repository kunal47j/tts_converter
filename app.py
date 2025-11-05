from flask import Flask, request, render_template, send_file, after_this_request
import pyttsx3
import os
import uuid

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tts', methods=['POST'])
def tts():
    text = request.form.get('text')
    voice_id = request.form.get('voice_id')
    rate = request.form.get('rate')

    if not text:
        return "Text is required", 400

    engine = pyttsx3.init()
    voices = engine.getProperty('voices')

    if voice_id:
        try:
            vid = int(voice_id)
            if 0 <= vid < len(voices):
                engine.setProperty('voice', voices[vid].id)
        except Exception:
            pass

    if rate:
        try:
            engine.setProperty('rate', int(rate))
        except Exception:
            pass

    filename = f"output_{uuid.uuid4().hex}.mp3"
    engine.save_to_file(text, filename)
    engine.runAndWait()

    @after_this_request
    def cleanup(resp):
        try:
            os.remove(filename)
        except Exception:
            pass
        return resp

    # Serve audio directly for inline playback
    return send_file(filename, mimetype="audio/mpeg")

if __name__ == '__main__':
    app.run(debug=True)
