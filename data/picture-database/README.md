# Picture Database

This folder stores sign language image datasets.

## Current datasets

- `asl/picture_database.json` - manifest for USL letter and phrase images.
- `bsl/picture_database.json` - manifest for BSL letter and phrase images.
- `isl/picture_database.json` - manifest for ISL letter and phrase images.

## Image placement

Put real images in:

- `asl/letters/` as `A.png` ... `Z.png`
- `asl/phrases/` as `HELLO.png`, `THANK_YOU.png`, etc.
- `bsl/letters/` as `A.png` ... `Z.png`
- `bsl/phrases/` as `HELLO.png`, `THANK_YOU.png`, etc.
- `isl/letters/` as `A.png` ... `Z.png`
- `isl/phrases/` as `NAMASTE.png`, `THANK_YOU.png`, etc.

The app (or future modules) can use the manifest file to map text/symbols to picture paths.
