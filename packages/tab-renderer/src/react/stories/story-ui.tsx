import { useEffect, useState, type ReactNode } from "react";
import {
  collectStorybookRuntimeHealth,
  type StorybookRuntimeHealth,
} from "achorde-storybook-config";
import type { ParseDiagnostic, ParsedTab, ParsedTabLineKind } from "../../core";
import { logTabRendererGroup, summarizeParsedTab } from "../../core";
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

export function ChordsFoundPanel({ song }: { song: ParsedTab }) {
  return (
    <div className="tab-story-chords-panel">
      <ParserVersionBadge
        parserVersion={song.parserVersion}
        astVersion={song.astVersion}
      />
      <p className="tab-story-chords-lede">
        <strong>{song.chordsFound.length}</strong> diagrammable chord(s) in{" "}
        <code>chordsFound</code> — deduplicated, no <code>/</code> marker.
      </p>
      {song.chordsFound.length > 0 ? (
        <ul className="tab-story-chords-found" aria-label="Extracted chords">
          {song.chordsFound.map((chord) => (
            <li key={chord}>
              <span className="tab-story-chord-chip">{chord}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="tab-story-diagnostics-empty">No chords found.</p>
      )}
      <AstSongSummary song={song} />
    </div>
  );
}

export function AstSongSummary({ song }: { song: ParsedTab }) {
  const lineCount = song.sections.reduce((n, s) => n + s.lines.length, 0);
  const tokenCount = countTokens(song);
  const titles = song.sections.map((s) => s.title ?? "(untitled)");
  const errorCount = song.diagnostics.filter(
    (d) => d.severity === "error",
  ).length;

  return (
    <pre className="tab-story-ast tab-story-ast-summary">
      {`parserVersion: ${song.parserVersion}\nastVersion: ${song.astVersion}\nsections: ${song.sections.length}\nlines: ${lineCount}\ntokens: ${tokenCount}\ndiagnostic errors: ${errorCount}\nchordsFound: ${song.chordsFound.join(", ") || "(none)"}\nsection titles: ${titles.join(", ")}`}
    </pre>
  );
}

export function ParserVersionBadge({
  parserVersion,
  astVersion,
}: {
  parserVersion: string;
  astVersion: string;
}) {
  return (
    <p className="tab-story-version-badge">
      <span>TAB_RENDERER_PARSER_VERSION</span> {parserVersion}
      <span>TAB_RENDERER_AST_VERSION</span> {astVersion}
    </p>
  );
}

export function PipelineDiagram() {
  return (
    <pre className="tab-story-pipeline" aria-label="Parser pipeline">
      {`raw body (string)
    │
    ▼
parseTab()  ──► ParsedTab
    │              ├─ sections[] → ParsedTabSection
    │              │                    └─ lines[] → ParsedTabLine (kind, text, tokens[])
    │              ├─ diagnostics[] (ParseDiagnostic)
    │              ├─ chordsFound[] (diagrammable, no "/")
    │              └─ parserVersion / astVersion
    │
    ▼
transposeParsedTab(parsed, semitones)  ──► ChordToken.text updated; line.text unchanged
    │
    ▼
collectDiagrammableChords(parsed)  ──► same semantics as chordsFound`}
    </pre>
  );
}

export function DiagnosticsList({
  diagnostics,
}: {
  diagnostics: ReadonlyArray<ParseDiagnostic>;
}) {
  if (diagnostics.length === 0) {
    return <p className="tab-story-diagnostics-empty">No diagnostics.</p>;
  }

  return (
    <ul className="tab-story-diagnostics">
      {diagnostics.map((diagnostic, index) => (
        <li
          key={`${diagnostic.code}-${diagnostic.line}-${index}`}
          className={`tab-story-diagnostic tab-story-diagnostic--${diagnostic.severity}`}
        >
          <span className="tab-story-diagnostic-code">{diagnostic.code}</span>
          <span className="tab-story-diagnostic-meta">
            line {diagnostic.line} · {diagnostic.severity}
          </span>
          <span className="tab-story-diagnostic-message">
            {diagnostic.message}
          </span>
        </li>
      ))}
    </ul>
  );
}

const LINE_KIND_LABEL: Record<ParsedTabLineKind, string> = {
  "section-header": "section-header",
  chords: "chords",
  lyrics: "lyrics",
  blank: "blank",
};

export function LineKindBadge({ kind }: { kind: ParsedTabLineKind }) {
  return (
    <span className={`tab-story-line-kind tab-story-line-kind--${kind}`}>
      {LINE_KIND_LABEL[kind]}
    </span>
  );
}

export function ParsedTabLineTable({ song }: { song: ParsedTab }) {
  const rows = song.sections.flatMap((section) =>
    section.lines.map((line) => ({
      section: section.title ?? "(untitled)",
      ...line,
    })),
  );

  return (
    <table className="tab-story-line-table">
      <thead>
        <tr>
          <th>Section</th>
          <th>kind</th>
          <th>text</th>
          <th>tokens</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.section}</td>
            <td>
              <LineKindBadge kind={row.kind} />
            </td>
            <td>
              <code>{row.text === "" ? "(blank)" : row.text}</code>
            </td>
            <td>{row.tokens.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function TransposeSymbolTable({
  rows,
}: {
  rows: ReadonlyArray<{
    input: string;
    semitones: number;
    output: string;
    label: string;
  }>;
}) {
  return (
    <table className="tab-story-line-table">
      <thead>
        <tr>
          <th>Case</th>
          <th>input</th>
          <th>semitones</th>
          <th>output</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.input}-${row.semitones}`}>
            <td>{row.label}</td>
            <td>
              <code>{row.input}</code>
            </td>
            <td>{row.semitones}</td>
            <td>
              <code>{row.output}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SideBySidePanels({
  leftTitle,
  rightTitle,
  left,
  right,
}: {
  leftTitle: string;
  rightTitle: string;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="tab-story-split">
      <div className="tab-story-split-pane">
        <StoryStepLabel>{leftTitle}</StoryStepLabel>
        {left}
      </div>
      <div className="tab-story-split-pane">
        <StoryStepLabel>{rightTitle}</StoryStepLabel>
        {right}
      </div>
    </div>
  );
}

export function ParseTabInspector({
  song,
  label = "parseTab",
}: {
  song: ParsedTab;
  label?: string;
}) {
  const summary = summarizeParsedTab(song);

  useEffect(() => {
    logTabRendererGroup(
      `${label}:inspect`,
      summarizeParsedTab(song),
      song.diagnostics,
    );
  }, [label, song]);

  return (
    <details className="tab-story-inspector" open>
      <summary>
        Inspector — {summary.diagnosticErrors} error(s), {summary.lines} line(s)
        <span className="tab-story-inspector-hint">
          {" "}
          (console: [tab-renderer])
        </span>
      </summary>
      <AstPreview value={summary} />
      {song.diagnostics.length > 0 ? (
        <DiagnosticsList diagnostics={song.diagnostics} />
      ) : null}
    </details>
  );
}

export function StorybookRuntimeHealthPanel() {
  const [health, setHealth] = useState<StorybookRuntimeHealth | null>(null);
  const [iframeStatus, setIframeStatus] = useState<number | "pending">(
    "pending",
  );

  useEffect(() => {
    setHealth(collectStorybookRuntimeHealth());

    const storyId =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("id")
        : null;
    const iframeUrl = storyId
      ? `/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`
      : "/iframe.html?viewMode=story";

    fetch(iframeUrl, { method: "HEAD" })
      .then((response) => setIframeStatus(response.status))
      .catch(() => setIframeStatus(0));
  }, []);

  return (
    <div className="tab-story-health">
      <StoryStepLabel>Storybook runtime health</StoryStepLabel>
      {health ? <AstPreview value={health} /> : null}
      <p className="tab-story-health-iframe">
        iframe HEAD:{" "}
        {iframeStatus === "pending" ? (
          "checking…"
        ) : iframeStatus === 200 ? (
          <strong className="tab-story-health-ok">200 OK</strong>
        ) : (
          <strong className="tab-story-health-bad">
            {iframeStatus} — se 500 com &quot;Missing field moduleType&quot;,
            confira Vite 7 em package.json
          </strong>
        )}
      </p>
    </div>
  );
}

export function InvalidSampleCard({
  title,
  body,
  song,
}: {
  title: string;
  body: string;
  song: ParsedTab;
}) {
  const line = song.sections[0]?.lines[0];

  return (
    <article className="tab-story-invalid-card">
      <h3 className="tab-story-invalid-card-title">{title}</h3>
      <RawBodyPreview body={body} />
      {line ? (
        <p className="tab-story-invalid-card-meta">
          <LineKindBadge kind={line.kind} /> · text preserved:{" "}
          <code>{line.text}</code>
        </p>
      ) : null}
      <DiagnosticsList diagnostics={song.diagnostics} />
    </article>
  );
}
