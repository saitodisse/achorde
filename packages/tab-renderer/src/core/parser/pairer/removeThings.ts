export function removeTablatures(text: string): string {
  const REGEX_REMOVE_TABLATURES = /[EBGDA]\|.+$(\r\n|\r|\n)?/gm;
  return text.replace(REGEX_REMOVE_TABLATURES, "");
}

export function removeBlankLines(text: string): string {
  const transformedLines: string[] = [];
  const REGEX_REMOVE_BLANK_LINES = /(\r\n|\r|\n)/g;
  const lines = text.split(REGEX_REMOVE_BLANK_LINES);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line.length > 0) {
      transformedLines.push(lines[i]);
    }
  }
  return transformedLines.join("\n");
}

export function removeAllThings(text: string): string {
  let transformedText = removeTablatures(text);
  transformedText = removeBlankLines(transformedText);
  transformedText = transformedText.replace(/\t/gm, "    ");
  return transformedText;
}
