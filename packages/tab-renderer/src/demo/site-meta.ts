export const LIB_NAME = "tab-renderer";
export const LIB_VERSION = "0.2.0";
export const LIB_LICENSE = "MIT";
export const SITE_URL = "https://tab-renderer-react.vercel.app/";
export const GITHUB_URL =
  "https://github.com/achorde/achorde/tree/main/packages/tab-renderer";
export const NPM_URL = "https://www.npmjs.com/package/tab-renderer";

export const INSTALL_SNIPPET =
  "pnpm add tab-renderer@git+https://github.com/achorde/achorde.git#main:packages/tab-renderer";

export const REACT_USAGE_SNIPPET = `import { Tab } from "tab-renderer/react";

<Tab
  body={chordSheetText}
  style={{
    fontSize: 21,
    displayMode: "both",
    viewMode: "e",
    transposeNumber: 0,
  }}
/>`;

export const CORE_USAGE_SNIPPET = `import { prepareSong } from "tab-renderer";

const prepared = prepareSong({
  body: chordSheetText,
  transposeNumber: 0,
  viewMode: "e",
});`;
