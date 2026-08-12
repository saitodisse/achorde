# How a chord-chart line gets its meaning

`tab-renderer` uses a small vocabulary to distinguish chords, lyrics, spacing, and visual decoration while preserving the author's original columns.

## In this note

- Chord and lyric lines
- Decorations versus chord extensions
- Slash alterations versus slash bass
- The chord-line majority rule

---

A chart line is like a row of labeled boxes. Some boxes hold chords, some hold sung words, and some only keep space so everything stays aligned. The parser labels each box before the renderer decides how to show it.

## Core vocabulary

**Chord line**:
A physical line made mostly of chord symbols and spacing. It may include parenthesis decorations that are not lyrics.

_Avoid_: chord row, harmony line

**Lyric line**:
A physical line of sung or spoken text. A real lyric word must not become a chord only because it starts with A through G.

_Avoid_: treating note-shaped lyric words as chords

**DecorationToken**:
A parenthesis stored separately when it is not part of a chord spelling. For example, `( C7` becomes a decoration `(` followed by the chord `C7`.

_Avoid_: punctuation token, annotation token

**Chord extension parentheses**:
Parentheses inside a chord spelling stay in one `ChordToken`. `C7(13)` and `B7(9-)` are chords, not stage directions.

_Avoid_: treating `(13)` as a visual direction

**Slash alteration**:
A slash followed by a number, as in `D7/9`, belongs to the chord extension. A slash followed by a note, as in `E7/G#`, describes a bass note.

_Avoid_: parsing `D7/9` as a slash bass

**Chord-line majority rule**:
A line is a chord line when it has more chord tokens than lyric tokens, or when it contains only chords, decorations, and spacing.

_Avoid_: calling any line with one chord a chord line

## Relationships

- A **Chord line** contains `ChordToken` values and may contain `DecorationToken` values.
- A **Lyric line** contains sung or spoken text and must not win classification through a note-shaped word.
- **DecorationToken** is never transposed and never appears in `chordsFound`.
- **Chord extension parentheses** and **Slash alteration** remain inside their chord symbol.

## A concrete line

Consider this input:

```text
             ( C7          B7 )        Em7      E7
```

The parentheses are visual directions around chords. They become `DecorationToken` values, while `C7`, `B7`, `Em7`, and `E7` become chord tokens. Decorations are never transposed and never appear in `chordsFound`.

> **Developer:** “Is this a chord line even with parentheses?”
>
> **Domain expert:** “Yes. The parentheses are visual directions around real chords, not lyrics.”

## Flagged ambiguities

- A line with the same number of chord and lyric tokens is not a chord line under the majority rule.
- A slash followed by text outside A through G or a number needs separate validation before it is called an alteration or bass note.

---

## Main ideas

- Meaning is assigned before rendering.
- Extensions stay inside chord symbols; visual parentheses do not.
- `chordsFound` contains only real, diagrammable chord symbols.
- Spacing remains part of the chart because it carries alignment.

## Vault connections

- [[../musical-domain/README|Musical Domain]] — defines the token and `ParsedTab` contracts used here.
- [[README|Tab Renderer]] — parses, transposes, prepares, and renders these lines.
- [[../svguitar-react/README|Chord Diagrams]] — consumes `chordsFound` without rescanning lyric text.
