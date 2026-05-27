import { useEffect, useState } from "react";
import { useDialKit, DialRoot } from "dialkit";
import { Tab } from "./react";
import { tuaFlorBody } from "./test/stubs/tua-flor";
import { StoryPanel } from "./react/stories/story-ui";
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
} from "./demo/site-meta";
import "./react/stories/stories.css";
import "./App.css";

function App() {
  const [pageTheme, setPageTheme] = useState<AppPageTheme>("light");
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 900px)").matches
      : false,
  );

  useEffect(() => {
    document.documentElement.dataset.appTheme = pageTheme;
  }, [pageTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches);
    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  const dial = useDialKit(TAB_STYLING_PANEL_NAME, stylingDialkitConfig, {
    onAction: (path) => {
      const theme = handleStylingPresetAction(path);
      if (theme) setPageTheme(theme);
    },
  });
  const style = stylingDialToTabStyle(dial);

  return (
    <div className="app-layout">
      <main className="app-shell">
        <section className="demo-panel" aria-label="Live demo">
          <div className="tab-story-frame">
            <StoryPanel caption="Live preview — interleaved pipeline, CSS chord offsets, and viewer preferences.">
              <Tab body={tuaFlorBody} style={style} className="tab-demo-1" />
            </StoryPanel>
          </div>
        </section>

        <header className="app-header">
          <div className="lib-hero-meta">
            <h1>{LIB_NAME}</h1>
            <p className="lib-badge">
              v{LIB_VERSION} · {LIB_LICENSE}
            </p>
          </div>
          <p className="lib-subtitle">
            Open-source chord sheet parsing and rendering
          </p>
          <p className="lede">
            {LIB_NAME} ships a headless core for parsing, transposition, and
            interleaved bar preparation, plus a React adapter with a styled{" "}
            <code>Tab</code> viewer and composable primitives for custom
            layouts. The live demo above uses the shared{" "}
            <code>tua-flor.txt</code> fixture — tweak every{" "}
            <code>TabStyleConfig</code> control in the panel on the right.
          </p>

          <div className="lib-actions">
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
        </header>
      </main>

      <aside
        id="app-style-controls"
        className={`app-controls${mobileControlsOpen ? " is-open" : ""}`}
        aria-label="Style controls"
        aria-hidden={isMobileViewport && !mobileControlsOpen}
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
        aria-expanded={mobileControlsOpen}
        aria-label={
          mobileControlsOpen ? "Hide style controls" : "Show style controls"
        }
        onClick={() => setMobileControlsOpen((open) => !open)}
      >
        {mobileControlsOpen ? "×" : "Style"}
      </button>
    </div>
  );
}

export default App;
