import { useEffect, useMemo, useState } from "react";
import { Tab, type TabStyleConfig } from "@achorde/tab-renderer/react";
import {
  analyzeChordChartText,
  type ChordChartSavePayload,
  type ChordChartTextAnalysis,
} from "../index";
import "../style.css";

export type ChordChartEditorEngine = "monaco-lazy" | "textarea";

export type ChordChartEditorLabels = {
  editorTitle: string;
  previewTitle: string;
  diagnosticsTitle: string;
  save: string;
  valid: string;
  warning: string;
  invalid: string;
  noDiagnostics: string;
  loadingEditor: string;
  fallbackEditor: string;
  chordsFound: string;
};

export type ChordChartEditorProps = {
  value: string;
  originalValue?: string;
  title?: string;
  sourceKey?: string;
  onChange: (value: string) => void;
  onSave?: (payload: ChordChartSavePayload) => void;
  editorEngine?: ChordChartEditorEngine;
  previewStyle?: Partial<TabStyleConfig>;
  labels?: Partial<ChordChartEditorLabels>;
};

const DEFAULT_LABELS: ChordChartEditorLabels = {
  editorTitle: "Editor",
  previewTitle: "Preview",
  diagnosticsTitle: "Diagnostics",
  save: "Save",
  valid: "Valid",
  warning: "Warnings",
  invalid: "Invalid",
  noDiagnostics: "No diagnostics.",
  loadingEditor: "Loading editor.",
  fallbackEditor: "Plain text editor",
  chordsFound: "Chords found",
};

type MonacoEditorComponent = typeof import("@monaco-editor/react")["default"];

function statusLabel(labels: ChordChartEditorLabels, analysis: ChordChartTextAnalysis) {
  switch (analysis.status) {
    case "valid":
      return labels.valid;
    case "warning":
      return labels.warning;
    case "invalid":
      return labels.invalid;
  }
}

function FallbackEditor({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}) {
  return (
    <textarea
      className="achorde-tab-editor__textarea"
      aria-label={ariaLabel}
      value={value}
      spellCheck={false}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );
}

function LazyMonacoEditorPane({
  value,
  onChange,
  sourceKey,
  labels,
}: {
  value: string;
  onChange: (value: string) => void;
  sourceKey?: string;
  labels: ChordChartEditorLabels;
}) {
  const [Editor, setEditor] = useState<MonacoEditorComponent | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import("@monaco-editor/react")
      .then((module) => {
        if (!cancelled) {
          setEditor(() => module.default);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) {
    return <FallbackEditor value={value} onChange={onChange} ariaLabel={labels.editorTitle} />;
  }

  if (!Editor) {
    return <p className="achorde-tab-editor__loading">{labels.loadingEditor}</p>;
  }

  return (
    <Editor
      height="420px"
      value={value}
      language="plaintext"
      theme="vs-light"
      options={{
        minimap: { enabled: false },
        wordWrap: "on",
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
      }}
      onChange={(nextValue) => onChange(nextValue ?? "")}
      loading={<p className="achorde-tab-editor__loading">{labels.loadingEditor}</p>}
      keepCurrentModel={false}
      path={sourceKey ? `${sourceKey}.txt` : "chord-chart.txt"}
    />
  );
}

export function ChordChartEditor({
  value,
  originalValue,
  title,
  sourceKey,
  onChange,
  onSave,
  editorEngine = "monaco-lazy",
  previewStyle,
  labels: labelsPartial,
}: ChordChartEditorProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsPartial };
  const analysis = useMemo(() => analyzeChordChartText(value), [value]);
  const hasChanges = originalValue === undefined ? false : originalValue !== value;
  const statusText = statusLabel(labels, analysis);
  const shouldUseTextarea = editorEngine === "textarea";

  const savePayload: ChordChartSavePayload = {
    ...analysis,
    value,
    originalValue,
    title,
    sourceKey,
    hasChanges,
  };

  return (
    <section className="achorde-tab-editor" aria-label={title ?? labels.editorTitle}>
      <header className="achorde-tab-editor__header">
        <div>
          {sourceKey ? <p className="achorde-tab-editor__eyebrow">{sourceKey}</p> : null}
          {title ? <h2>{title}</h2> : null}
        </div>
        <div className="achorde-tab-editor__status" data-status={analysis.status}>
          <span>{statusText}</span>
          <strong>{analysis.chordsFound.length}</strong>
        </div>
      </header>

      <div className="achorde-tab-editor__layout">
        <div className="achorde-tab-editor__pane">
          <div className="achorde-tab-editor__pane-header">
            <h3>{labels.editorTitle}</h3>
            {shouldUseTextarea ? (
              <span className="achorde-tab-editor__engine">{labels.fallbackEditor}</span>
            ) : null}
          </div>
          {shouldUseTextarea ? (
            <FallbackEditor value={value} onChange={onChange} ariaLabel={labels.editorTitle} />
          ) : (
            <LazyMonacoEditorPane
              value={value}
              onChange={onChange}
              sourceKey={sourceKey}
              labels={labels}
            />
          )}
        </div>

        <div className="achorde-tab-editor__pane">
          <div className="achorde-tab-editor__pane-header">
            <h3>{labels.previewTitle}</h3>
            <span>{labels.chordsFound}: {analysis.chordsFound.length}</span>
          </div>
          <div className="achorde-tab-editor__preview">
            <Tab body={value} style={previewStyle} />
          </div>
        </div>
      </div>

      <div className="achorde-tab-editor__footer">
        <section className="achorde-tab-editor__diagnostics" aria-label={labels.diagnosticsTitle}>
          <h3>{labels.diagnosticsTitle}</h3>
          {analysis.diagnostics.length === 0 ? (
            <p>{labels.noDiagnostics}</p>
          ) : (
            <ul>
              {analysis.diagnostics.map((diagnostic, index) => (
                <li key={`${diagnostic.code}-${diagnostic.line}-${index}`} data-severity={diagnostic.severity}>
                  <strong>{diagnostic.code}</strong>
                  <span>line {diagnostic.line}</span>
                  <p>{diagnostic.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {onSave ? (
          <button
            className="achorde-tab-editor__save"
            type="button"
            onClick={() => onSave(savePayload)}
          >
            {labels.save}
          </button>
        ) : null}
      </div>
    </section>
  );
}
