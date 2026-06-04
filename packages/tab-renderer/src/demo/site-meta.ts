export const LIB_NAME = "@achorde/tab-renderer";
export const LIB_VERSION = "0.2.0";
export const LIB_LICENSE = "MIT";
export const SITE_URL = "https://tab-renderer-react.vercel.app/";
export const GITHUB_URL =
  "https://github.com/achorde/achorde/tree/main/packages/tab-renderer";
export const NPM_URL = "https://www.npmjs.com/package/@achorde/tab-renderer";

export const INSTALL_SNIPPET = "pnpm add @achorde/tab-renderer";

export const REACT_USAGE_SNIPPET = `import { Tab } from "@achorde/tab-renderer/react";

<Tab
  body={chordSheetText}
  style={{
    fontSize: 21,
    displayMode: "both",
    viewMode: "e",
    transposeNumber: 0,
  }}
/>`;

export const CORE_USAGE_SNIPPET = `import { parseTab, transposeParsedTab } from "@achorde/tab-renderer";

const parsed = parseTab(chordSheetText);
// parsed.chordsFound — diagrammable symbols (no "/")
// parsed.diagnostics — strict authoring errors

const transposed = transposeParsedTab(parsed, 2);`;
