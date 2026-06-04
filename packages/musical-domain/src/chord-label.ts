function trimText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

/**
 * Normalizes a chord label for library lookup equality.
 * Case is preserved (`Cm6` ≠ `CM6`). Unicode accidentals become `#` / `b`.
 */
export function normalizeChordSymbolLabel(value: string): string {
  return trimText(value)
    .normalize("NFKC")
    .replace(/♯/g, "#")
    .replace(/♭/g, "b");
}
