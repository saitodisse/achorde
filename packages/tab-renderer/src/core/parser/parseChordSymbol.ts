import type { ParsedChordSymbol } from "../types";

const CHORD_ROOT_RE = /^([A-G])([#b♯♭]?)(.*)$/;
const CHORD_BASS_RE = /^([A-G])([#b♯♭]?)$/;

function normalizeNoteName(note: string): string {
  return note.replace("♯", "#").replace("♭", "b");
}

function noteLooksValid(note: string): boolean {
  return /^[A-G][#b]?$/.test(note);
}

export function parseChordSymbol(token: string): ParsedChordSymbol | null {
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
