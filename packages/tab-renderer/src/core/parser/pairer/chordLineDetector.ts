import { REGEX_IS_REAL_CHORD } from "../extractor/parseChord";

export function isChordLine(text: string): boolean {
  if (/^[ \t]*\[(.*?)\][ \t]*$/.test(text)) {
    return false;
  }

  const chords: string[] = [];
  const regex = new RegExp(
    REGEX_IS_REAL_CHORD.source,
    REGEX_IS_REAL_CHORD.flags,
  );
  let result = regex.exec(text);
  while (result) {
    chords.push(result[0]);
    result = regex.exec(text);
  }

  let allContent = text;
  allContent = allContent?.replace(/\w+\s*?:/g, "");
  allContent = allContent?.replace(/\[[^\]]+\]/g, "");
  allContent = allContent?.replace(/\s+/g, "");
  const allContentLength = allContent.length;

  const allChords = chords.join("");
  const allChordsLength = allChords.length;

  const diffLength = allContentLength - allChordsLength;
  const percentDiff = allContentLength > 0 ? diffLength / allContentLength : 1;

  if (percentDiff < 0.2 || (percentDiff < 0.5 && chords?.length >= 2)) {
    return true;
  }

  return false;
}
