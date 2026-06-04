import { GUITAR_STANDARD_EADGBE_OPEN_NOTES } from "@achorde/musical-domain";

/** Scientific pitch names high → low for stringIndex 1..6 */
export const DEFAULT_GUITAR_TUNING = [...GUITAR_STANDARD_EADGBE_OPEN_NOTES] as string[];

export const STANDARD_INLAY_FRETS = [3, 5, 7, 9, 12, 15];

/** Radius of open/fretted note dots in viewBox units (matches SVG `r`). */
export const FRET_DOT_RADIUS = 14;

/** Gap between tuning label and the nearest edge of a fret-0 dot. */
export const TUNING_LABEL_GAP = 10;

/**
 * Extra space along the fret axis before the nut when `showTuning` is true
 * (room for label glyphs + {@link TUNING_LABEL_GAP} + dot radius).
 */
export const TUNING_NUT_INSET = FRET_DOT_RADIUS + TUNING_LABEL_GAP + 18;
