# PROJECT REFERENCE

## Project Name

USL Sign Language Translator

## What This Project Does

This is a browser-based sign language interface built with HTML, CSS, and JavaScript.
It focuses on two main directions:

- USL to Text (camera/video sign capture and recognition output)
- Text to USL (typed text converted to sign-style output and sign images)

## Core Features

- Live hand-sign detection using MediaPipe hand landmarks
- Rule-based classifier for sign prediction
- Stabilization logic (consensus + cooldown) to reduce noisy predictions
- Text to USL conversion with phrase mapping and fingerspelling fallback
- Sign image rendering from picture-database manifests
- Multi-language sign profile structure (USL, BSL, ISL)
- Offline persistence with IndexedDB (settings, session, sign datasets)
- Optional online sync adapter

## Key Files

- `index.html` - main interface structure
- `styles.css` - layout, theme, and responsive styling
- `js/app.js` - app orchestration and flow logic
- `js/classifier.js` - hand-sign classification rules
- `js/landmarks.js` - landmark detection and smoothing
- `js/ui.js` - DOM references and render helpers
- `js/offlineStore.js` - IndexedDB persistence layer
- `data/picture-database/` - sign image manifests and asset folders

## Data Structure

- `data/picture-database/asl/picture_database.json`
- `data/picture-database/bsl/picture_database.json`
- `data/picture-database/isl/picture_database.json`

Each manifest maps:

- letters (A-Z) to image paths
- phrases (e.g., HELLO, THANK YOU) to image paths

## Current Notes

- Phrase image selection is prioritized over letter-by-letter image fallback.
- Language profiles are handled independently in the UI selectors.
- Recognition quality depends on lighting, framing, and model/rule limits.

## Existing Detailed Documents

- `PROJECT NOTES.md` - detailed running notes and feature summary
- `SYSTEM_GUIDE.md` - technical architecture and module-level guide

