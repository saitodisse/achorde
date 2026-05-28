# tab-renderer — strict chord chart parsing

Headless parser and React adapter for Brazilian-style chord charts (`ParsedTab` AST).

## Language

**Chord line**:
A physical line whose content is mostly chord symbols and spacing; may include parenthesis decorations that are not lyrics.

_Avoid_: chord row, harmony line

**Lyric line**:
A physical line whose content is sung or spoken text, not a chord chart row.

**DecorationToken**:
A parenthesis character tokenized separately from a chord symbol when it is not glued into the chord spelling (e.g. `( C7` → `(` + `C7`).

_Avoid_: punctuation token, annotation token (for other marks)

**Chord extension parentheses**:
Parentheses that spell an alteration inside the symbol (e.g. `C7(13)`, `B7(9-)`) stay inside a single **ChordToken** and are not **DecorationToken**.

_Avoid_: treating `(13)` as stage direction

**Slash alteration**:
A slash followed by a figure (e.g. `D7/9`) is part of the chord spelling, not a bass note. Contrast with **Slash bass** (`E7/G#`) where the right-hand note is `A`–`G`.

_Avoid_: parsing `D7/9` as `D7` with bass `9`

**Chord line majority rule**:
A line is classified as `chords` when it has more chord tokens than lyric tokens, or when lyric tokens are absent and only chords and decorations remain.

_Avoid_: chord density heuristic (legacy pairer only)

## Relationships

- A **Chord line** contains one or more **ChordToken** values and may contain **DecorationToken** values
- A **Lyric line** contains **LyricToken** values and must not be classified as `chords` when real lyric words outnumber chords
- **DecorationToken** is never transposed and never listed in `chordsFound`

## Example dialogue

> **Dev:** "Should `             ( C7          B7 )        Em7      E7` be a chord line?"
> **Domain expert:** "Yes — the parentheses are stage directions around chords, not lyrics. Only actual words should force `lyrics`."

## Flagged ambiguities

- Legacy `isChordLine()` in the styled pairer uses character-density heuristics; strict `parseTab()` uses token-majority instead.
