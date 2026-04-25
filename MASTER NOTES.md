# MASTER NOTES

## 1) System Overview

This project is a browser-based sign-language translation system built with vanilla HTML, CSS, and JavaScript. It focuses on two practical directions:

- **USL to Text**: detect hand signs from live camera/video and convert to textual output.
- **Text to USL**: convert typed text into sign-oriented output (token text + sign image mapping).

The system is designed as an offline-first web app with optional cloud-sync hooks and a modular architecture for iterative improvement.

## 2) Core Objectives

- Provide a usable MVP for sign-assisted communication in-browser.
- Keep the stack simple (no heavy frontend framework).
- Offer real-time interaction and feedback.
- Support extension to multiple sign language profiles (USL/BSL/ISL scaffolding).
- Preserve data locally for reliability when offline.

## 3) Technical Architecture

### UI Layer

- `index.html`
  - Defines the interface sections for USL-to-Text and Text-to-USL workflows.
  - Includes controls, status display, metrics, and output areas.

- `styles.css`
  - Handles theme, layout, spacing, responsive behavior, visual components.
  - Includes custom scroll behavior and output styling.

- `js/ui.js`
  - Central DOM adapter.
  - Exposes helper methods to update UI state consistently (status, output, sign output, image grids, etc.).

### Processing Layer

- `js/landmarks.js`
  - Integrates MediaPipe Hand Landmarker.
  - Detects up to two hands.
  - Applies temporal smoothing across recent frames.

- `js/classifier.js`
  - Rule-based classifier using geometric features from landmarks.
  - Produces label + confidence output.
  - Uses thresholds and heuristic model scoring.

- `js/app.js`
  - Main orchestration layer.
  - Binds events, manages state, drives render loop.
  - Applies stabilization rules:
    - minimum confidence
    - consensus frames
    - cooldown window
  - Performs Text-to-USL conversion and image mapping.

### Data Layer

- `js/offlineStore.js`
  - IndexedDB wrapper for settings, session state, and sign-language datasets.
  - Seeds USL/BSL/ISL reference entries.

- `js/onlineStore.js`
  - Optional online sync adapter (Supabase-style REST integration pattern).

- Picture database manifests:
  - `data/picture-database/asl/picture_database.json`
  - `data/picture-database/bsl/picture_database.json`
  - `data/picture-database/isl/picture_database.json`

## 4) End-to-End Flow

### USL to Text

1. User selects camera or video input.
2. App starts frame loop via `requestAnimationFrame`.
3. Landmarks are detected and smoothed.
4. Classifier predicts sign tokens with confidence.
5. Stabilization logic accepts only sufficiently stable predictions.
6. Output updates:
   - current sign + confidence
   - interpreted text
   - sign output block

### Text to USL

1. User selects sign language profile.
2. User types message.
3. Phrase mapping attempts full-phrase conversion first.
4. If phrase match fails, fallback to tokenized letter output.
5. Image mapping attempts to load corresponding phrase/letter assets.
6. Sequence playback can animate/sign-speak through mapped items.

## 5) Current Merits (Strengths)

- **Simple deployment**: runs in a browser with static hosting.
- **Modular codebase**: clear separation of UI, orchestration, detection, and storage.
- **Real-time interaction**: immediate frame-level feedback and output updates.
- **Stabilization controls**: reduces jitter/noise in predictions.
- **Offline capability**: local persistence for settings and session continuity.
- **Extensible profile model**: structure supports USL/BSL/ISL paths and manifests.
- **Developer-friendly**: plain JS with readable architecture and no framework lock-in.

## 6) Current Limitations
The current limitations are manageable and mostly related to scope, data coverage, and runtime environment:

- **Recognition scope**: rule-based detection is reliable for clear, common signs, but still improves with additional model training for subtle or fast gestures.
- **Environment sensitivity**: performance is best with good lighting and stable camera framing.
- **Sequence depth**: long, motion-heavy sign sentences are only partially covered in the current setup.
- **Dataset coverage**: the manifest structure is ready, but quality depends on complete and accurate image assets.
- **Language parity**: USL is currently the most complete profile; BSL and ISL are supported and can be expanded further.
- **Browser differences**: behavior can vary slightly by browser/device permissions and media API support.

In summary, the foundation is strong and production-ready for core flows, with the main improvements being richer datasets, deeper sequence modeling, and wider cross-device validation.


- **Rule-based recognition ceiling**:
  - Heuristics are sensitive to hand orientation, angle, and partial occlusion.
  - Similar signs can still be confused.

- **Lighting and camera variability**:
  - Recognition quality can degrade under poor lighting or motion blur.

- **Dynamic sign complexity**:
  - Motion-heavy signs/grammar are not fully modeled compared with sequence ML approaches.

- **Dataset completeness**:
  - Image manifest structure exists for multiple profiles, but real image assets must exist for accurate visual mapping.

- **Language parity**:
  - USL profile is currently the strongest practical path.
  - BSL/ISL scaffolding exists but requires deeper model/profile tuning and richer assets.

- **Browser API constraints**:
  - Speech/vision behavior may vary across browsers and environments.

## 7) Risk Areas

- Over-reliance on heuristic thresholds can produce unstable behavior across users/devices.
- Mismatched or missing image assets can create output trust issues if not clearly flagged.
- Performance can vary on lower-end devices during simultaneous camera + rendering + speech operations.

## 8) Quality and Reliability Notes

- Stabilization (consensus + cooldown) is key to avoiding repeated false accepts.
- Confidence thresholds should be tuned conservatively for real-world use.
- Image-token validation should remain strict so displayed sign images match intended tokens.

## 9) Recommended Next Improvements

1. Introduce ML-assisted sequence classification for higher accuracy.
2. Add calibration mode per user/device for robust threshold tuning.
3. Expand verified phrase and letter datasets for each sign language profile.
4. Add dataset validator tooling to detect missing/mismatched image assets.
5. Add test harnesses for classifier regression and UI output consistency.
6. Add telemetry/debug mode for field tuning (local-only, privacy-preserving).

## 10) Practical Run Notes

- Run via local server (not `file://`) for camera/browser APIs:

```bash
cd /Users/mc2/Desktop/projects/sign-language-interpeter
python3 -m http.server 8080
```

- Open:
  - `http://localhost:8080`

## 11) Final Assessment

This program is a strong, practical MVP for browser-based sign-language interaction. Its main value is accessibility, modularity, and ease of extension. Its main challenge is recognition accuracy under real-world variability, which is expected in rule-based systems and can be improved through dataset expansion + model evolution.

## 12) Translation Quality Incorporation

The translation quality criteria are incorporated as an implementation baseline:

- **Implemented strongly**: consistency, speed/efficiency, and baseline confidentiality/privacy controls.
- **Implemented partially**: accuracy, fluency, cultural sensitivity, terminology depth, context awareness, adaptability, and proofreading.
- **Current enforcement points**: confidence/stabilization logic, phrase-first mapping, profile-aware datasets, offline-first storage, and legal/compliance notice.
- **Next enforcement points**: domain terminology packs, ambiguity/low-confidence quality flags, and dedicated review/proofreading before final output use.
