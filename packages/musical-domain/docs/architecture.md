# One musical language across packages

`@achorde/musical-domain` gives parsers, renderers, editors, and applications the same small vocabulary so they can exchange musical data without depending on one another.

## In this note

- What belongs in the shared domain
- What stays in specialized packages
- How guitar strings are numbered
- How contract changes are released

---

Think of this package as the legend on a map. It explains what every symbol means, but it does not choose the route, draw the landscape, or store your trip history.

The shared vocabulary includes parsed chord symbols, `ParsedTab`, parser diagnostics, fretted-instrument voicings, chord-label normalization, voicing selection, display-fret helpers, and a port for external music-theory engines.

For example, a parser can return a `ParsedTab`, a React package can render it, and an application can store it. All three agree on the shape without importing each other's implementation.

## The boundary

The package contains contracts and pure musical helpers. It does not contain React, routing, local storage, synchronization, SVG drawing, authored catalog data, or product rules.

This leads to a simple ownership rule:

- parsers decide how text becomes musical structures;
- renderers decide how those structures look;
- editors decide how people change them;
- applications decide how data is stored and synchronized;
- `@achorde/musical-domain` defines the shared meaning between them.

## Guitar string coordinates

Guitar voicings always use low-to-high string coordinates. In standard EADGBE tuning, `stringIndex: 1` is low E and `stringIndex: 6` is high E. Barres use the same order.

Fret notation also reads low E first. The shape `x32010` therefore means muted low E, fret 3 on A, fret 2 on D, open G, fret 1 on B, and open high E.

A visual package may mirror the drawing for handedness, but it must not rewrite the canonical string indices.

## Compatibility

Contract changes follow semantic versioning. Patches clarify or fix compatible details, minor releases add compatible types or fields, and major releases may remove or reshape public contracts.

`ChordChartAst` remains available for older consumers, but new code should use `ParsedTab`.

---

## Main ideas

- The domain package defines meaning, not product behavior.
- Shared contracts prevent each package from inventing its own musical model.
- Guitar data stays low-E-first even when a view is mirrored.
- Breaking contract changes require a major release.

## Vault connections

- [[../../source-catalog/README|Source Catalog]] — publishes musical records with stable public contracts.
- [[../../tab-renderer/README|Tab Renderer]] — turns chart text into the shared `ParsedTab` model.
- [[../../svguitar-react/README|SVGuitar React]] — draws shared voicings without owning their identity.
- [[../../interactive-fretboard/README|Interactive Fretboard]] — edits the same voicing contract through pointer input.
