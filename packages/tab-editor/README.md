# @achorde/tab-editor

Reusable chord chart editor for the Achorde ecosystem.

The package exposes headless analysis/proposal helpers from `@achorde/tab-editor`
and a React editor from `@achorde/tab-editor/react`. The React editor loads
Monaco lazily by default and falls back to a plain textarea when Monaco is not
available.

## Install

```sh
pnpm add @achorde/tab-editor @achorde/tab-renderer
```

React and React DOM are peer dependencies.

## Headless API

```ts
import { analyzeChordChartText, createTextChangeProposal } from "@achorde/tab-editor";

const analysis = analyzeChordChartText("[Verse]\nC G\nHello");
const proposal = createTextChangeProposal({
  path: "catalog/charts/demo.md",
  before: oldText,
  after: newText,
});
```

## React API

```tsx
import { ChordChartEditor } from "@achorde/tab-editor/react";
import "@achorde/tab-editor/style.css";

export function Editor() {
  const [value, setValue] = useState("");

  return (
    <ChordChartEditor
      value={value}
      originalValue=""
      title="Demo"
      sourceKey="C"
      onChange={setValue}
      onSave={(payload) => console.log(payload)}
    />
  );
}
```

`onSave` receives a derived payload only. This package does not persist data,
write Markdown, call Git, use IndexedDB, or know about AC15.

## Focused editing surface

Consumers that need a simple authoring flow may opt into the focused layout:
plain text writing, a separate preview tab, and collapsible diagnostics. The
package keeps its existing split Monaco layout as the backwards-compatible
default. The consumer owns labels, local drafts, content metadata, validation,
and the final save action.
