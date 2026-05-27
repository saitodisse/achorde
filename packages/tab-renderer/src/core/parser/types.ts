/** Chord parsed into its component parts. */
export type SimpleChord = {
  original: string;
  rootNote: string | null;
  quality: string | null;
  bassNote: string | null;
};

/** A chord with position and beat information. */
export type ChordItem = {
  chordPosition?: number;
  beatType?: "strong" | "week";
  simpleChord: SimpleChord | null;
};

/** A paired chord line + lyric line within a section. */
export type BarLine = {
  liricsTextBar: string;
  chordsTextBar?: string;
  sufixBar?: string;
  chordsList?: ChordItem[];
};

/** A section of a tab (e.g. [Verse], [Chorus]) with its lines. */
export type SectionText = {
  title: string | null;
  content: string | null;
  lines?: BarLine[] | null;
};

/** A single renderable item (lyric part, chord, or space). */
export type BarsListItem = {
  liricPart?: string;
  chordItem?: ChordItem;
  isSpace?: boolean;
  isNoLyricsLine?: boolean;
};

export type BarsList = BarsListItem[];

/** A section with its bar list ready for rendering. */
export type SectionBarList = {
  content: string | null;
  title: string | null;
  barList: BarsList;
};
