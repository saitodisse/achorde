import { tokenizeContentWord } from "../tokenizeContentWord";

export function isChordLine(text: string): boolean {
  if (/^[ \t]*\[(.*?)\][ \t]*$/.test(text)) {
    return false;
  }

  const words = text.match(/[^\s]+/g) ?? [];
  let chordCount = 0;

  for (const word of words) {
    if (/^[|()]+$/.test(word)) {
      continue;
    }

    const tokens = tokenizeContentWord(word, 0);
    if (tokens.some((token) => token.kind === "LyricToken")) {
      return false;
    }

    if (tokens.some((token) => token.kind === "ChordToken")) {
      chordCount += 1;
    }
  }

  return chordCount > 0;
}
