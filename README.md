# Sign Language Interpreter Web App

This project is a browser-based app built with **HTML, CSS, and JavaScript**.
It includes:

- Sign capture from **camera** or **video file**
- Rule-based ASL letter recognition (with landmark detection)
- Real-time interpreted text output
- **Text-to-Speech (TTS)**
- **Speech-to-Text (STT)**

---

## 1) What the system does

The app has 3 main tabs:

1. **Sign Interpreter**
   - Reads hand landmarks from video
   - Predicts a sign/letter
   - Shows current sign, confidence, FPS, and accumulated output text
2. **Text to Speech**
   - You type text and the browser reads it aloud
   - Choose voice and speech rate
3. **Speech to Text**
   - Uses microphone input
   - Converts speech into text transcript in real time

---

## 2) Quick Start (Run the app)

### Step 1: Open terminal in project folder

```bash
cd "/Users/mc2/Desktop/projects/sign-language-interpeter"
```

### Step 2: Start local server

```bash
python3 -m http.server 8080
```

### Step 3: Open in browser

[http://localhost:8080](http://localhost:8080)

### Step 4: First use checklist

- Allow camera permission when prompted
- Keep internet on for first launch so hand-tracking assets cache
- In app `SETTINGS`, choose connection mode (`Auto`, `Offline only`, `Online preferred`)

### Stop the app

Press `Ctrl + C` in the terminal running the server.

### If port 8080 is busy

Use another port:

```bash
python3 -m http.server 8081
```

Then open [http://localhost:8081](http://localhost:8081).

## 3) How to run locally (details)

Do not open `index.html` directly with `file://`.
Use a local web server so camera and module imports work correctly.

From project folder:

```bash
cd /Users/mc2/Desktop/projects/sign-language-interpeter
python3 -m http.server 8080
```

Open in browser:

`http://localhost:8080`

Recommended browsers:
- Latest Chrome / Edge
- Safari (newer versions)

## Offline Database (Local)

This project now includes an offline local database using **IndexedDB**.

Stored locally on your device:
- latest interpreted sign output text,
- latest speech-to-text transcript,
- speech settings (selected voice and rate).

Data restores automatically when you reopen the app.

## Offline App Mode

The app now registers a Service Worker (`sw.js`) to cache the local app shell:

- `index.html`, `styles.css`, JS modules
- local picture database manifests and attached local ASL image assets

After opening the app once, you can reopen it offline and still use:

- Text to ASL / Words to Images
- local UI, settings, and stored session data

Note:
- Camera sign recognition uses a remote MediaPipe hand model on first load.
- If internet is unavailable before that model loads at least once, camera recognition will show an offline model message.

## Online Database (Cloud Sync)

The project now supports an online database using a Supabase REST endpoint.

1. Edit `js/config.js`:
   - set `onlineDb.enabled` to `true`
   - set `onlineDb.supabaseUrl`
   - set `onlineDb.supabaseAnonKey`
2. Create these tables in Supabase:
   - `app_sessions` (primary key: `id`)
   - `app_settings` (primary key: `key`)
   - `sign_languages` (primary key: `id`)

When configured, the app syncs:
- session text (`output`, `sttText`),
- speech settings (rate, voice),
- sign language datasets.

---

## 4) Project structure

```text
sign-language-interpeter/
  index.html
  styles.css
  README.md
  js/
    app.js
    config.js
    ui.js
    camera.js
    videoInput.js
    landmarks.js
    classifier.js
    speech.js
    speechToText.js
```

### File responsibilities

- `index.html`: UI layout and tabs (Sign, TTS, STT)
- `styles.css`: Theme, layout, interactions, visual feedback
- `js/app.js`: Main orchestration, event handlers, app state, loop
- `js/ui.js`: DOM references and UI update helpers
- `js/camera.js`: Webcam stream setup/stop and compatibility handling
- `js/videoInput.js`: Video file playback input
- `js/landmarks.js`: MediaPipe hand landmark setup + smoothing
- `js/classifier.js`: Rule-based sign classification logic
- `js/speech.js`: Text-to-speech wrapper (voice/rate/stop)
- `js/speechToText.js`: Speech recognition wrapper (start/stop callbacks)
- `js/config.js`: Tunable app thresholds/config

---

## 5) System flow (Sign Interpreter)

1. User starts camera or chooses a video file
2. `app.js` frame loop reads each video frame
3. `landmarks.js` extracts hand landmarks
4. `classifier.js` scores likely letter/sign
5. Stabilization logic confirms repeated frames
6. Accepted token is appended to output text
7. Optional per-symbol speech is played

---

## 6) Main controls

### Sign Interpreter tab

- **Start / Stop**: start or stop recognition
- **Reset text / Clear output**: clear interpreted text
- **Toggle debug**: show raw prediction/debug details
- **Speak interpreted text**: read current interpreted output aloud

### Text to Speech tab

- Type text into input box
- **Speak typed text** to read it aloud
- **Stop speaking** to cancel
- Select **Voice** and adjust **Rate**

### Speech to Text tab

- **Start speech-to-text** to begin microphone transcription
- **Stop speech-to-text** to end
- **Clear transcript** to reset
- **Copy transcript** to clipboard

---

## 7) Important limitations

- Sign recognition is currently **rule-based heuristic**, not a trained full-production model.
- Some letters can still be confused depending on hand angle, lighting, and motion.
- STT availability depends on browser support for:
  - `SpeechRecognition` or `webkitSpeechRecognition`

---

## 8) Troubleshooting

### Camera error: "Camera API is not supported in this browser."

Usually means insecure context or unsupported browser.

Fix:
- Run on `http://localhost` (or HTTPS)
- Use modern browser
- Check camera permissions in browser settings

### STT buttons disabled

Your browser likely does not support the speech recognition API.
Try latest Chrome/Edge.

### No voice options shown in TTS

Voices are loaded asynchronously by browser speech engine.
Wait a moment or refresh page.

---

## 9) Legal and Compliance

- **Consent**: Obtain informed consent before recording or processing camera/video of any person.
- **Data handling**: By default, data is stored locally in browser storage; enable online sync only when policy allows.
- **Accuracy disclaimer**: Outputs are assistive and may be incorrect; human verification is required.
- **Restricted use**: Do not use this system as the sole basis for medical, legal, law-enforcement, safety-critical, or emergency decisions.
- **Regional compliance**: Ensure usage follows applicable privacy and biometric/data protection rules in your jurisdiction.

---

## 10) Tuning recognition

You can tune thresholds in:

- `js/config.js`
- `js/classifier.js`

Useful knobs:
- confidence threshold
- consensus frame count
- cooldown timing
- per-letter heuristic rules

---

## 11) Next improvements (optional)

- Improve rule-based ASL heuristics and calibration presets
- Word/phrase-level decoding
- Better dynamic sign handling (motion trajectory)
- Save/export session text
- Multi-language STT/TTS support

---

## 12) Translation Quality Standards

Use this checklist for evaluating translation output quality:

1. **Accuracy**
   - Correctly conveys source meaning without adding, omitting, or changing information.
   - Preserves technical terms, idioms, and context-specific meaning.

2. **Fluency and Naturalness**
   - Reads smoothly in the target language.
   - Avoids awkward or overly literal phrasing.

3. **Cultural Sensitivity**
   - Handles cultural nuance, idioms, and local expressions.
   - Adapts wording to be culturally appropriate for the audience.

4. **Terminology Knowledge**
   - Uses correct domain terms (legal, medical, technical, scientific).
   - Keeps domain terminology accurate and appropriate.

5. **Consistency**
   - Uses uniform terminology and style throughout a document.
   - Maintains consistent tone, formatting, and conventions.

6. **Context Awareness**
   - Interprets meaning by context, not word-for-word only.
   - Resolves ambiguous words and phrases correctly.

7. **Speed and Efficiency**
   - Delivers translations quickly without sacrificing quality.
   - Handles larger text volumes effectively.

8. **Confidentiality and Security**
   - Protects sensitive content and user data.
   - Follows privacy and data-protection standards.

9. **Adaptability**
   - Handles multiple language pairs and styles.
   - Adjusts tone for formal, casual, technical, or literary audiences.

10. **Editing and Proofreading**
   - Supports review and refinement before final delivery.
   - Detects grammar, punctuation, and style issues.

---

## 13) Incorporation Status in This Project

The standards above are incorporated as follows:

1. **Accuracy** - **Partially implemented**
   - Rule-based recognition with confidence, consensus frames, and cooldown controls.
   - Phrase-first then token fallback for text-to-sign mapping.

2. **Fluency and Naturalness** - **Partially implemented**
   - Smooth UI output flow and sequence playback for readability.
   - No full natural-language rewriting layer yet.

3. **Cultural Sensitivity** - **Partially implemented**
   - Multi-profile structure (ASL/BSL/ISL) with profile-based output paths.
   - Cultural localization policy still needs dedicated review workflow.

4. **Terminology Knowledge** - **Partially implemented**
   - Consistent technical labels and mapped sign tokens.
   - Domain-specific terminology packs are not yet added.

5. **Consistency** - **Implemented**
   - Centralized UI/state updates and stable token/image mapping behavior.
   - Uniform style and formatting controlled through shared CSS/components.

6. **Context Awareness** - **Partially implemented**
   - Phrase matching captures common context before letter-level fallback.
   - Deep contextual disambiguation is not fully modeled.

7. **Speed and Efficiency** - **Implemented**
   - Real-time frame loop with lightweight heuristics and local execution.
   - Handles interactive workloads efficiently in browser.

8. **Confidentiality and Security** - **Implemented (baseline)**
   - Offline-first local storage, optional cloud sync, legal notice/disclaimer.
   - Production privacy controls (retention policy, audit) can be expanded.

9. **Adaptability** - **Partially implemented**
   - Supports multiple sign profiles and settings modes.
   - Audience-style adaptation (formal/casual/literary) is not yet available.

10. **Editing and Proofreading** - **Partially implemented**
   - User can review visible output and copy/clear before use.
   - No dedicated grammar/style auto-proofreading engine yet.

### Recommended next actions

- Add domain terminology packs (medical/legal/technical) with strict token maps.
- Add review mode with quality flags (low confidence, ambiguity, missing assets).
- Add optional proofreading pass for final exported text.

---
