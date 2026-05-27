import type {
  ParsedChordSymbol,
  ParseDiagnostic,
  ParsedTab,
  ParsedTabLine,
  ParsedTabLineKind,
  ParsedTabSection,
  ParsedTabToken,
} from "./types";

export const TAB_RENDERER_PARSER_VERSION = "1.0.0";
export const TAB_RENDERER_AST_VERSION = "1.0.0";

const CHORD_ROOT_RE = /^([A-G])([#b♯♭]?)(.*)$/;
const CHORD_BASS_RE = /^([A-G])([#b♯♭]?)$/;
const SECTION_LABEL_RE = /^\s*\[([^\]]+)\](.*)$/;
const COMMENT_LINE_RE = /^\s*(#|\/\/)/;
const COMMENT_PAREN_RE = /^\s*\([^)]*\)\s*$/;
const TAB_LINE_RE = /^\s*[EADGBe]\|/;
const CHORDISH_RE = /[A-G][#b♯♭]?|\/|[0-9]/;
const STRICT_LINE_DIAGNOSTIC_CODES = {
  invalidLine: "invalid-line",
  invalidChordToken: "invalid-chord-token",
  chordsAndLyricsOnSameLine: "chords-and-lyrics-on-same-line",
  sectionHeaderWithContent: "section-header-with-content",
} as const;

function normalizeLabel(label: string): string {
  return label.trim().replace(/\s+/g, " ");
}

function normalizeNoteName(note: string): string {
  return note.replace("♯", "#").replace("♭", "b");
}

function noteLooksValid(note: string): boolean {
  return /^[A-G][#b]?$/.test(note);
}

function createSectionId(order: number): string {
  return `section-${order + 1}`;
}

function createLineId(sectionOrder: number, lineOrder: number): string {
  return `section-${sectionOrder + 1}-line-${lineOrder + 1}`;
}

function parseChordSymbol(token: string): ParsedChordSymbol | null {
  if (token === "/") {
    return { kind: "repeat", text: token };
  }

  const parts = token.split("/");
  if (parts.length > 2) {
    return null;
  }

  const left = parts[0] ?? "";
  const rootMatch = left.match(CHORD_ROOT_RE);
  if (!rootMatch) {
    return null;
  }

  const root = normalizeNoteName(`${rootMatch[1]}${rootMatch[2] ?? ""}`);
  if (!noteLooksValid(root)) {
    return null;
  }

  const suffix = rootMatch[3] ?? "";
  let bass: string | undefined;

  if (parts.length === 2) {
    const bassMatch = parts[1]?.match(CHORD_BASS_RE);
    if (!bassMatch) {
      return null;
    }

    bass = normalizeNoteName(`${bassMatch[1]}${bassMatch[2] ?? ""}`);
    if (!noteLooksValid(bass)) {
      return null;
    }
  }

  return bass === undefined
    ? {
        kind: "chord",
        text: token,
        root,
        suffix,
      }
    : {
        kind: "chord",
        text: token,
        root,
        suffix,
        bass,
      };
}

function tokenizeRawLine(raw: string): ParsedTabToken[] {
  if (raw.trim().length === 0) {
    return [];
  }

  const tokens: ParsedTabToken[] = [];
  const pattern = /\s+|[^\s]+/g;

  for (const match of raw.matchAll(pattern)) {
    const text = match[0] ?? "";
    const startColumn = match.index ?? 0;
    const endColumn = startColumn + text.length;

    if (/^\s+$/.test(text)) {
      tokens.push({
        kind: "SpaceToken",
        text,
        startColumn,
        endColumn,
      });
      continue;
    }

    const chord = parseChordSymbol(text);
    tokens.push({
      kind: chord ? "ChordToken" : "LyricToken",
      text,
      startColumn,
      endColumn,
      ...(chord ? { chord } : {}),
    });
  }

  return tokens;
}

function classifyLine(raw: string, tokens: ParsedTabToken[]): ParsedTabLineKind {
  if (raw.trim().length === 0) {
    return "blank";
  }

  const contentTokens = tokens.filter((token) => token.kind !== "SpaceToken");
  const chordCount = contentTokens.filter((token) => token.kind === "ChordToken").length;

  if (chordCount === contentTokens.length) {
    return "chords";
  }

  return "lyrics";
}

function buildLineDiagnostic(
  raw: string,
  tokens: ParsedTabToken[],
  lineNumber: number,
): ParseDiagnostic | null {
  const contentTokens = tokens.filter((token) => token.kind !== "SpaceToken");

  if (raw.trim().length === 0) {
    return null;
  }

  if (COMMENT_LINE_RE.test(raw) || COMMENT_PAREN_RE.test(raw) || TAB_LINE_RE.test(raw)) {
    return {
      code: STRICT_LINE_DIAGNOSTIC_CODES.invalidLine,
      message: `Line ${lineNumber} is not a valid strict chord-chart line.`,
      severity: "error",
      line: lineNumber,
      sourceRange: {
        startColumn: 0,
        endColumn: raw.length,
      },
    };
  }

  if (contentTokens.length === 0) {
    return {
      code: STRICT_LINE_DIAGNOSTIC_CODES.invalidLine,
      message: `Line ${lineNumber} is not a valid strict chord-chart line.`,
      severity: "error",
      line: lineNumber,
      sourceRange: {
        startColumn: 0,
        endColumn: raw.length,
      },
    };
  }

  const chordTokens = contentTokens.filter((token) => token.kind === "ChordToken");
  const lyricTokens = contentTokens.filter((token) => token.kind === "LyricToken");

  if (chordTokens.length > 0 && lyricTokens.length > 0) {
    return {
      code: STRICT_LINE_DIAGNOSTIC_CODES.chordsAndLyricsOnSameLine,
      message: `Line ${lineNumber} mixes chords and lyrics on the same line.`,
      severity: "error",
      line: lineNumber,
      sourceRange: {
        startColumn: 0,
        endColumn: raw.length,
      },
    };
  }

  if (
    lyricTokens.length > 0 &&
    contentTokens.some((token) => token.kind === "LyricToken" && CHORDISH_RE.test(token.text))
  ) {
    return {
      code: STRICT_LINE_DIAGNOSTIC_CODES.invalidChordToken,
      message: `Line ${lineNumber} contains an invalid chord token.`,
      severity: "error",
      line: lineNumber,
      sourceRange: {
        startColumn: 0,
        endColumn: raw.length,
      },
    };
  }

  return null;
}

function collectFoundChords(sections: ParsedTabSection[]): ReadonlyArray<string> {
  const seen = new Set<string>();
  const chordsFound: string[] = [];

  for (const section of sections) {
    for (const line of section.lines) {
      for (const token of line.tokens) {
        if (token.kind !== "ChordToken" || !token.chord || token.chord.kind !== "chord") {
          continue;
        }

        if (seen.has(token.chord.text)) {
          continue;
        }

        seen.add(token.chord.text);
        chordsFound.push(token.chord.text);
      }
    }
  }

  return chordsFound;
}

export function parseTab(body: string): ParsedTab {
  const diagnostics: ParseDiagnostic[] = [];
  const sections: ParsedTabSection[] = [];
  const rawLines = body.split(/\r?\n/);

  let currentSection: ParsedTabSection | null = null;

  const ensureCurrentSection = (): ParsedTabSection => {
    if (currentSection) {
      return currentSection;
    }

    currentSection = {
      id: createSectionId(sections.length),
      order: sections.length,
      title: null,
      originalTitle: null,
      lines: [],
    };
    return currentSection;
  };

  const finalizeCurrentSection = (): void => {
    if (!currentSection) {
      return;
    }

    if (currentSection.lines.length > 0 || currentSection.title !== null) {
      sections.push(currentSection);
    }

    currentSection = null;
  };

  rawLines.forEach((rawLine, rawIndex) => {
    const labelMatch = rawLine.match(SECTION_LABEL_RE);

    if (labelMatch) {
      const originalTitle = normalizeLabel(labelMatch[1] ?? "");
      const remainder = (labelMatch[2] ?? "").replace(/^\s+/, "");

      finalizeCurrentSection();
      currentSection = {
        id: createSectionId(sections.length),
        order: sections.length,
        title: originalTitle,
        originalTitle,
        lines: [],
      };

      if (remainder.length > 0) {
        const lineOrder = currentSection.lines.length;
        const tokens = tokenizeRawLine(remainder);
        const kind = classifyLine(remainder, tokens);
        const diagnostic = buildLineDiagnostic(remainder, tokens, rawIndex + 1);
        const line: ParsedTabLine = {
          id: createLineId(currentSection.order, lineOrder),
          order: lineOrder,
          text: remainder,
          kind,
          tokens,
        };

        if (diagnostic) {
          diagnostics.push(diagnostic);
        }

        currentSection.lines.push(line);
      }

      return;
    }

    if (currentSection === null && rawLine.trim().length === 0) {
      return;
    }

    const section = ensureCurrentSection();
    const lineOrder = section.lines.length;
    const tokens = tokenizeRawLine(rawLine);
    const kind = classifyLine(rawLine, tokens);
    const diagnostic = buildLineDiagnostic(rawLine, tokens, rawIndex + 1);
    const line: ParsedTabLine = {
      id: createLineId(section.order, lineOrder),
      order: lineOrder,
      text: rawLine,
      kind,
      tokens,
    };

    if (diagnostic) {
      diagnostics.push(diagnostic);
    }

    section.lines.push(line);
  });

  finalizeCurrentSection();

  return {
    body,
    sections,
    diagnostics,
    parserVersion: TAB_RENDERER_PARSER_VERSION,
    astVersion: TAB_RENDERER_AST_VERSION,
    chordsFound: collectFoundChords(sections),
  };
}
