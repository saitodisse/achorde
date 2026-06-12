import { useEffect, useMemo, useState } from "react";
import { useDialKit, DialRoot } from "dialkit";
import { parseTab } from "./core";
import {
  LiveDemoMobileTabs,
  LiveDemoWideDemo,
  useLiveDemoSplitLayout,
} from "./demo/live-demo-workspace";
import { Tab } from "./react";
import { tuaFlorBody } from "./test/stubs/tua-flor";
import {
  stylingDialkitConfig,
  TAB_STYLING_PANEL_NAME,
  handleStylingPresetAction,
  stylingDialToTabStyle,
  type AppPageTheme,
} from "./demo/styling-dialkit";
import {
	CORE_USAGE_SNIPPET,
	GITHUB_URL,
	INSTALL_SNIPPET,
	LIB_LICENSE,
	LIB_NAME,
	LIB_VERSION,
	NPM_URL,
	REACT_USAGE_SNIPPET,
	STORYBOOK_URL,
} from "./demo/site-meta";
import "./react/stories/stories.css";
import "./App.css";

function App() {
  const [pageTheme, setPageTheme] = useState<AppPageTheme>("light");
  const [styleControlsOpen, setStyleControlsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.appTheme = pageTheme;
  }, [pageTheme]);

  const dial = useDialKit(TAB_STYLING_PANEL_NAME, stylingDialkitConfig, {
    onAction: (path) => {
      const theme = handleStylingPresetAction(path);
      if (theme) setPageTheme(theme);
    },
  });
  const style = stylingDialToTabStyle(dial);
  const [chartSource, setChartSource] = useState(tuaFlorBody);
  const parsedSong = useMemo(() => parseTab(chartSource), [chartSource]);
  const isLiveDemoSplit = useLiveDemoSplitLayout();

  const liveDemoResult = (
    <Tab body={chartSource} style={style} className="tab-demo-1" />
  );

  return (
    <div className="app-layout">
      <main className="app-shell">
        <header className="app-header app-header--hero">
          <div className="lib-hero-meta">
            <h1>{LIB_NAME}</h1>
            <p className="lib-badge">
              v{LIB_VERSION} · {LIB_LICENSE}
            </p>
          </div>
          <p className="lib-subtitle">
            Open-source chord sheet parsing and rendering
          </p>
        </header>

        <section className="demo-panel" aria-label="Live demo">
          {isLiveDemoSplit ? (
            <LiveDemoWideDemo
              source={chartSource}
              onSourceChange={setChartSource}
              previewCaption=""
              parsed={parsedSong}
              result={liveDemoResult}
            />
          ) : (
            <div className="tab-story-frame app-live-split">
              <LiveDemoMobileTabs
                source={chartSource}
                onSourceChange={setChartSource}
                parsed={parsedSong}
                result={liveDemoResult}
              />
            </div>
          )}
        </section>

        <div className="app-header app-header--docs">
          <p className="lede">
            {LIB_NAME} ships a headless core for parsing, transposition, and
            interleaved bar preparation, plus a React adapter with a styled{" "}
            <code>Tab</code> viewer and composable primitives for custom
            layouts. The chart above starts from <code>tua-flor.txt</code>; edit
            in <strong>Source</strong> and inspect <code>parseTab</code> under{" "}
            <strong>Transformation</strong>. Tune every{" "}
            <code>TabStyleConfig</code> control in the panel on the right.
          </p>

          <div className="lib-actions">
            <a
              className="lib-button"
              href={STORYBOOK_URL}
              target="_blank"
              rel="noreferrer"
            >
              Storybook
            </a>
            <a
              className="lib-button lib-button-primary"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </a>
            <a
              className="lib-button"
              href={NPM_URL}
              target="_blank"
              rel="noreferrer"
            >
              npm package
            </a>
          </div>

          <div className="lib-docs">
            <section className="lib-doc-block">
              <h2>Install</h2>
              <p>
                Peer dependencies: <code>react</code> and <code>react-dom</code>{" "}
                (^18 or ^19).
              </p>
              <pre className="lib-code">
                <code>{INSTALL_SNIPPET}</code>
              </pre>
            </section>

            <section className="lib-doc-block">
              <h2>React usage</h2>
              <p>
                Import from <code>tab-renderer/react</code> for the styled
                viewer.
              </p>
              <pre className="lib-code">
                <code>{REACT_USAGE_SNIPPET}</code>
              </pre>
            </section>

            <section className="lib-doc-block">
              <h2>Headless core</h2>
              <p>
                Import from <code>tab-renderer</code> when you only need the
                prepared bar list or token AST.
              </p>
              <pre className="lib-code">
                <code>{CORE_USAGE_SNIPPET}</code>
              </pre>
            </section>
          </div>
        </div>
      </main>

      <aside
        id="app-style-controls"
        className={`app-controls${styleControlsOpen ? " is-open" : ""}`}
        aria-label="Style controls"
        aria-hidden={!styleControlsOpen}
      >
        <DialRoot
          mode="inline"
          defaultOpen
          theme={pageTheme}
          productionEnabled
        />
      </aside>

      <button
        type="button"
        className="app-controls-toggle"
        aria-controls="app-style-controls"
        aria-expanded={styleControlsOpen}
        aria-label={
          styleControlsOpen ? "Hide style controls" : "Show style controls"
        }
        onClick={() => setStyleControlsOpen((open) => !open)}
      >
        {styleControlsOpen ? "×" : "Style"}
      </button>
    </div>
  );
}

export default App;
