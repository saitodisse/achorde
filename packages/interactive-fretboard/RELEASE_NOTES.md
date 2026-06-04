# Release Notes

## Version 0.1.6

**Release date:** June 4, 2026

### Fret labels and chord detection (0.1.5)

Fret dot labels and chord detection now transpose by semitone count (`Interval.fromSemitones`). Previously, Tonal v6 treated `1m` as unison, so the first fret showed open-string note names.

### Tuning labels (0.1.6)

When `showTuning` is enabled, the layout reserves space before the nut (`nutInset`) and places tuning labels to the left of open-string dots, avoiding overlap with fret-0 markers.

### Storybook

Stories expose all component props in the Controls panel, including a `Playground` story and fullscreen horizontal layouts for easier visual QA.

```bash
pnpm add @achorde/interactive-fretboard
```
