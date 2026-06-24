import { GUITAR_STANDARD_EADGBE_OPEN_NOTES } from "@achorde/musical-domain";

/** Scientific pitch names low → high for stringIndex 1..6 */
export const DEFAULT_GUITAR_TUNING = [...GUITAR_STANDARD_EADGBE_OPEN_NOTES] as string[];

export const STANDARD_INLAY_FRETS = [3, 5, 7, 9, 12, 15];

/** Default radius of open/fretted note dots in viewBox units. */
export const DEFAULT_DOT_RADIUS = 21;

/** @deprecated Use {@link DEFAULT_DOT_RADIUS}. */
export const FRET_DOT_RADIUS = DEFAULT_DOT_RADIUS;

/** Extra radius added to {@link DEFAULT_DOT_RADIUS} for the hover ring. */
export const DEFAULT_DOT_HOVER_PADDING = 3;

/** @deprecated Use {@link DEFAULT_DOT_RADIUS} + {@link DEFAULT_DOT_HOVER_PADDING}. */
export const FRET_DOT_HOVER_RADIUS = DEFAULT_DOT_RADIUS + DEFAULT_DOT_HOVER_PADDING;

export const DEFAULT_DOT_LABEL_FONT_SIZE = 17;
export const DEFAULT_FRET_LABEL_FONT_SIZE = 10;
export const DEFAULT_TUNING_LABEL_FONT_SIZE = 10;
export const DEFAULT_INLAY_RADIUS = 6;

/** Gap between tuning label and the nearest edge of a fret-0 dot. */
export const DEFAULT_TUNING_LABEL_GAP = 10;

/** @deprecated Use {@link DEFAULT_TUNING_LABEL_GAP}. */
export const TUNING_LABEL_GAP = DEFAULT_TUNING_LABEL_GAP;

/**
 * Extra space along the fret axis before the nut when `showTuning` is true
 * (room for label glyphs + gap + dot radius).
 */
export const DEFAULT_TUNING_NUT_INSET = DEFAULT_DOT_RADIUS + DEFAULT_TUNING_LABEL_GAP + 18;

/** @deprecated Use {@link DEFAULT_TUNING_NUT_INSET}. */
export const TUNING_NUT_INSET = DEFAULT_TUNING_NUT_INSET;
