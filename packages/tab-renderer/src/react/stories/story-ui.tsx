import type { ReactNode } from "react";
import type { ParsedTab } from "../../core";
import { countTokens } from "./story-tua-flor";

export function StoryStepLabel({ children }: { children: ReactNode }) {
  return <p className="tab-story-step-label">{children}</p>;
}

export function StoryPanel({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="tab-story-panel">
      <p className="tab-story-caption">{caption}</p>
      {children}
    </div>
  );
}

export function RawBodyPreview({ body }: { body: string }) {
  return <pre className="tab-story-raw">{body}</pre>;
}

export function AstPreview({ value }: { value: unknown }) {
  return <pre className="tab-story-ast">{JSON.stringify(value, null, 2)}</pre>;
}

export function AstSongSummary({ song }: { song: ParsedTab }) {
  const lineCount = song.sections.reduce((n, s) => n + s.lines.length, 0);
  const tokenCount = countTokens(song);
  const titles = song.sections.map((s) => s.title ?? "(untitled)");

  return (
    <pre className="tab-story-ast tab-story-ast-summary">
      {`sections: ${song.sections.length}\nlines: ${lineCount}\ntokens: ${tokenCount}\nsection titles: ${titles.join(", ")}`}
    </pre>
  );
}
