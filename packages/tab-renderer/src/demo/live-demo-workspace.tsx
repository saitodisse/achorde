import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import type { ParsedTab } from "../core";
import {
  AstPreview,
  ChordsFoundPanel,
  ParsedTabLineTable,
} from "../react/stories/story-ui";

export type LiveDemoTab = "source" | "output";

export type LiveDemoPreviewTab =
  | "result"
  | "chords"
  | "details"
  | "sections"
  | "json";

const PREVIEW_TABS: ReadonlyArray<{
  id: LiveDemoPreviewTab;
  label: string;
}> = [
  { id: "result", label: "Rendered" },
  { id: "chords", label: "Chords" },
  { id: "details", label: "Details" },
  { id: "sections", label: "Sections" },
  { id: "json", label: "Complete JSON" },
];

type LiveDemoSourcePanelProps = {
  source: string;
  onSourceChange: (value: string) => void;
  showCaption?: boolean;
};

type LiveDemoWideSplitProps = {
  baseId: string;
  activeTab: LiveDemoPreviewTab;
  source: string;
  onSourceChange: (value: string) => void;
  previewCaption: string;
  parsed: ParsedTab;
  result: ReactNode;
};

type LiveDemoWideDemoProps = Omit<
  LiveDemoWideSplitProps,
  "baseId" | "activeTab"
>;

type LiveDemoPreviewWorkspaceProps = {
  parsed: ParsedTab;
  result: ReactNode;
  previewCaption?: string;
  showCaption?: boolean;
};

const SPLIT_LAYOUT_QUERY = "(min-width: 1100px)";

export function useLiveDemoSplitLayout(): boolean {
  const [isSplit, setIsSplit] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(SPLIT_LAYOUT_QUERY).matches
      : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(SPLIT_LAYOUT_QUERY);
    const syncLayout = () => setIsSplit(mediaQuery.matches);
    syncLayout();
    mediaQuery.addEventListener("change", syncLayout);
    return () => mediaQuery.removeEventListener("change", syncLayout);
  }, []);

  return isSplit;
}

function sectionsPreviewValue(song: ParsedTab) {
  return song.sections.map((section) => ({
    title: section.title ?? null,
    lines: section.lines.map((line) => ({
      id: line.id,
      kind: line.kind,
      text: line.text,
      tokenCount: line.tokens.length,
    })),
  }));
}

function JsonPreviewPanel({ parsed }: { parsed: ParsedTab }) {
  const jsonText = useMemo(() => JSON.stringify(parsed, null, 2), [parsed]);
  const [copyLabel, setCopyLabel] = useState("Copy to clipboard");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopyLabel("Copied!");
    } catch {
      setCopyLabel("Copy failed");
    }

    window.setTimeout(() => setCopyLabel("Copy to clipboard"), 2000);
  }

  return (
    <div className="app-live-json-preview">
      <AstPreview value={parsed} />
      <div className="app-live-json-preview-actions">
        <button
          type="button"
          className="lib-button"
          onClick={() => void handleCopy()}
        >
          {copyLabel}
        </button>
      </div>
    </div>
  );
}

function LiveDemoPreviewPanel({
  tab,
  parsed,
  result,
}: {
  tab: LiveDemoPreviewTab;
  parsed: ParsedTab;
  result: ReactNode;
}) {
  switch (tab) {
    case "result":
      return <>{result}</>;
    case "chords":
      return <ChordsFoundPanel song={parsed} />;
    case "details":
      return <ParsedTabLineTable song={parsed} />;
    case "sections":
      return <AstPreview value={sectionsPreviewValue(parsed)} />;
    case "json":
      return <JsonPreviewPanel parsed={parsed} />;
  }
}

function LiveDemoPreviewTabList({
  baseId,
  activeTab,
  onSelect,
}: {
  baseId: string;
  activeTab: LiveDemoPreviewTab;
  onSelect: (tab: LiveDemoPreviewTab) => void;
}) {
  return (
    <div
      className="app-live-tabs app-live-preview-tabs"
      role="tablist"
      aria-label="Preview views"
    >
      {PREVIEW_TABS.map((tab) => (
        <PreviewTabTrigger
          key={tab.id}
          id={`${baseId}-preview-tab-${tab.id}`}
          panelId={`${baseId}-preview-panel-${tab.id}`}
          isActive={activeTab === tab.id}
          onSelect={() => onSelect(tab.id)}
        >
          {tab.label}
        </PreviewTabTrigger>
      ))}
    </div>
  );
}

function LiveDemoPreviewCaption({
  previewCaption,
}: {
  previewCaption: string;
}) {
  return (
    <div className="app-live-split-header app-live-split-label">
      <p className="tab-story-caption app-live-preview-caption">
        {previewCaption}
      </p>
    </div>
  );
}

function LiveDemoPreviewPanels({
  baseId,
  activeTab,
  parsed,
  result,
}: {
  baseId: string;
  activeTab: LiveDemoPreviewTab;
  parsed: ParsedTab;
  result: ReactNode;
}) {
  return (
    <div className="tab-story-panel app-live-preview-panels">
      {PREVIEW_TABS.map((tab) => (
        <div
          key={tab.id}
          id={`${baseId}-preview-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-preview-tab-${tab.id}`}
          className="app-live-preview-panel"
          hidden={activeTab !== tab.id}
        >
          <LiveDemoPreviewPanel tab={tab.id} parsed={parsed} result={result} />
        </div>
      ))}
    </div>
  );
}

export function LiveDemoPreviewWorkspace({
  parsed,
  result,
  previewCaption = "Live preview",
  showCaption = true,
}: LiveDemoPreviewWorkspaceProps) {
  const baseId = useId();
  const [activeTab, setActiveTab] = useState<LiveDemoPreviewTab>("result");

  return (
    <div className="app-live-preview-workspace">
      {showCaption ? (
        <LiveDemoPreviewCaption previewCaption={previewCaption} />
      ) : null}
      <LiveDemoPreviewTabList
        baseId={baseId}
        activeTab={activeTab}
        onSelect={setActiveTab}
      />
      <div className="app-live-output">
        <LiveDemoPreviewPanels
          baseId={baseId}
          activeTab={activeTab}
          parsed={parsed}
          result={result}
        />
      </div>
    </div>
  );
}

export function LiveDemoWideDemo({
  source,
  onSourceChange,
  previewCaption,
  parsed,
  result,
}: LiveDemoWideDemoProps) {
  const baseId = useId();
  const [activeTab, setActiveTab] = useState<LiveDemoPreviewTab>("result");

  return (
    <>
      <LiveDemoPreviewTabList
        baseId={baseId}
        activeTab={activeTab}
        onSelect={setActiveTab}
      />
      <div className="tab-story-frame app-live-split app-live-split--wide">
        <LiveDemoWideSplit
          baseId={baseId}
          activeTab={activeTab}
          source={source}
          onSourceChange={onSourceChange}
          previewCaption={previewCaption}
          parsed={parsed}
          result={result}
        />
      </div>
    </>
  );
}

export function LiveDemoWideSplit({
  baseId,
  activeTab,
  source,
  onSourceChange,
  previewCaption,
  parsed,
  result,
}: LiveDemoWideSplitProps) {
  return (
    <>
      <p
        className="tab-story-caption app-live-split-label"
        title="Raw chord chart — edits trigger `parseTab(source)` in real time."
      >
        Source
      </p>
      <LiveDemoPreviewCaption previewCaption={previewCaption} />
      <LiveDemoSourcePanel
        source={source}
        onSourceChange={onSourceChange}
        showCaption={false}
      />
      <div className="app-live-output">
        <LiveDemoPreviewPanels
          baseId={baseId}
          activeTab={activeTab}
          parsed={parsed}
          result={result}
        />
      </div>
    </>
  );
}

export function LiveDemoSourcePanel({
  source,
  onSourceChange,
  showCaption = true,
}: LiveDemoSourcePanelProps) {
  return (
    <section
      className="app-live-panel app-live-panel--source"
      aria-label="Source"
    >
      {showCaption ? (
        <p
          className="tab-story-caption"
          title="Raw chord chart — edits trigger `parseTab(source)` in real time."
        >
          Raw chord chart
        </p>
      ) : null}
      <textarea
        className="app-live-source"
        value={source}
        onChange={(event) => onSourceChange(event.target.value)}
        spellCheck={false}
        aria-label="Chord chart source"
      />
    </section>
  );
}

type LiveDemoMobileTabsProps = {
  source: string;
  onSourceChange: (value: string) => void;
  parsed: ParsedTab;
  result: ReactNode;
  previewCaption?: string;
};

export function LiveDemoMobileTabs({
  source,
  onSourceChange,
  parsed,
  result,
  previewCaption = "Live preview",
}: LiveDemoMobileTabsProps) {
  const baseId = useId();
  const [activeTab, setActiveTab] = useState<LiveDemoTab>("source");

  return (
    <div className="app-live-workspace app-live-workspace--stacked">
      <div className="app-live-tabs" role="tablist" aria-label="Live demo">
        <TabTrigger
          id={`${baseId}-tab-source`}
          panelId={`${baseId}-panel-source`}
          isActive={activeTab === "source"}
          onSelect={() => setActiveTab("source")}
        >
          Source
        </TabTrigger>
        <TabTrigger
          id={`${baseId}-tab-output`}
          panelId={`${baseId}-panel-output`}
          isActive={activeTab === "output"}
          onSelect={() => setActiveTab("output")}
        >
          Output
        </TabTrigger>
      </div>

      <div className="app-live-panels">
        <div
          id={`${baseId}-panel-source`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-source`}
          hidden={activeTab !== "source"}
        >
          <LiveDemoSourcePanel
            source={source}
            onSourceChange={onSourceChange}
          />
        </div>

        <div
          id={`${baseId}-panel-output`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-output`}
          className="app-live-output-stack"
          hidden={activeTab !== "output"}
        >
          <LiveDemoPreviewWorkspace
            parsed={parsed}
            result={result}
            previewCaption={previewCaption}
            showCaption={false}
          />
        </div>
      </div>
    </div>
  );
}

function PreviewTabTrigger({
  id,
  panelId,
  isActive,
  onSelect,
  children,
}: {
  id: string;
  panelId: string;
  isActive: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      className={`app-live-tab app-live-preview-tab${isActive ? " is-active" : ""}`}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}

function TabTrigger({
  id,
  panelId,
  isActive,
  onSelect,
  children,
}: {
  id: string;
  panelId: string;
  isActive: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      className={`app-live-tab${isActive ? " is-active" : ""}`}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}
