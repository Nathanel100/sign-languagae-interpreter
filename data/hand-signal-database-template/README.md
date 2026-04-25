## Hand Signal Database Template

This folder helps you build a reliable sign-image database that actually reflects hand signals.

Use this template when collecting images for USL, BSL, and ISL.

### Folder layout

- `asl/manifest.template.json`
- `bsl/manifest.template.json`
- `isl/manifest.template.json`
- `samples/labels.template.csv`

### What makes a good sign image database

- One canonical image per token (`A`, `B`, `HELLO`, `THANK_YOU`, etc.)
- Clear filename/token match (`HELLO` -> `HELLO.png`)
- Language isolation (USL images only in USL manifest, etc.)
- Pose metadata so you can verify hand orientation and hand count
- Source/license tracking for each image

### Recommended image rules

- Background: plain and high contrast
- Lighting: neutral, no hard shadows
- Resolution: at least 512x512 for letters, 1024x576 for phrase shots
- Framing: include full hand(s), no cropped fingertips
- Naming: uppercase with underscores for phrases (`GOOD_MORNING.png`)

### Next step

1. Copy each `manifest.template.json` to `manifest.json`.
2. Fill token entries with your real image paths and metadata.
3. Move/copy real images into language folders under your own dataset root.
4. Point your app loader to these manifests when ready.
