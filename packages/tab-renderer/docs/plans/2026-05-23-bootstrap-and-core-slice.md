# Tab Renderer Bootstrap and Core Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the library as a publishable Vite project, then implement the first headless core slice and React adapter slice with TDD.

**Architecture:** The package will be a single npm artifact with two public entrypoints: `.` for the core and `./react` for the adapter. The core will own parsing, normalization, and transformation into a minimal AST. The React layer will consume that AST and expose composable primitives plus a convenient `Tab` wrapper.

**Tech Stack:** Vite, React 19, TypeScript, Storybook, Vitest, Testing Library

---

### Task 1: Convert the Vite scaffold into a library package

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `tsconfig.app.json`
- Modify: `vite.config.ts`
- Create: `src/index.ts`
- Create: `src/react.ts`

- [ ] **Step 1: Verify the scaffolded project shape**

Run: `npm create vite@latest . -- --template react-ts`
Expected: project files exist and the app starts from the default Vite React template.

- [ ] **Step 2: Define the package entrypoints**

```json
{
  "name": "tab-renderer",
  "version": "0.1.0",
  "private": false,
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./react": {
      "types": "./dist/react.d.ts",
      "default": "./dist/react.js"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 3: Make TypeScript emit library-friendly declarations**

```json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": false,
    "rootDir": "."
  }
}
```

- [ ] **Step 4: Add library exports**

```ts
export * from "./core";
export * from "./react";
```

- [ ] **Step 5: Run the package build**

Run: `npm run build`
Expected: the build succeeds and produces `dist/` output for both entrypoints.

### Task 2: Add Storybook and testing infrastructure

**Files:**
- Create: `.storybook/main.ts`
- Create: `.storybook/preview.ts`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Storybook for Vite and Vitest support**

Run: `npx storybook@latest init --builder vite --no-dev`
Expected: Storybook config files and dependencies are added for the Vite framework.

- [ ] **Step 2: Add test scripts**

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Configure Vitest for React**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"]
  }
});
```

- [ ] **Step 4: Verify the test runner boots**

Run: `npm test`
Expected: Vitest runs, even if no project tests exist yet.

### Task 3: Build the headless AST core with TDD

**Files:**
- Create: `src/core/types.ts`
- Create: `src/core/transform.ts`
- Create: `src/core/parse.ts`
- Create: `src/core/index.ts`
- Create: `src/core/__tests__/transform.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { transform } from "../transform";

describe("transform", () => {
  it("normalizes raw chord sheet text into a song AST", () => {
    const result = transform("[Verse]\nC   G\nHello world");

    expect(result.sections).toHaveLength(1);
    expect(result.sections[0].title).toBe("Verse");
    expect(result.sections[0].lines[0].tokens.some((token) => token.kind === "ChordToken")).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- src/core/__tests__/transform.test.ts`
Expected: failure because `transform` does not exist yet.

- [ ] **Step 3: Implement the minimal core**

```ts
export function transform(body: string) {
  return {
    title: null,
    sections: body ? [{ title: "Verse", lines: [] }] : []
  };
}
```

- [ ] **Step 4: Replace the stub with the real AST pipeline**

Implement:
- section splitting
- line tokenization
- chord, lyric, and whitespace token discrimination
- minimal normalization without layout hints

- [ ] **Step 5: Run the test and confirm it passes**

Run: `npm test -- src/core/__tests__/transform.test.ts`
Expected: PASS

### Task 4: Build the React adapter with composition and a convenience wrapper

**Files:**
- Create: `src/react/types.ts`
- Create: `src/react/Tab.tsx`
- Create: `src/react/TabRoot.tsx`
- Create: `src/react/TabSection.tsx`
- Create: `src/react/TabLine.tsx`
- Create: `src/react/TabChord.tsx`
- Create: `src/react/TabLyric.tsx`
- Create: `src/react/__tests__/Tab.test.tsx`

- [ ] **Step 1: Write the failing React rendering test**

```tsx
import { render, screen } from "@testing-library/react";
import { Tab } from "../Tab";

it("renders a song through the React adapter", () => {
  render(<Tab body="[Verse]\nC Hello" />);

  expect(screen.getByText("Verse")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `npm test -- src/react/__tests__/Tab.test.tsx`
Expected: failure because the adapter does not exist yet.

- [ ] **Step 3: Implement the smallest adapter**

```tsx
export function Tab({ body }: { body: string }) {
  return <div>{body}</div>;
}
```

- [ ] **Step 4: Replace the stub with composable primitives**

Implement the primitive components so they read from the normalized AST and render sections, lines, chords, and lyric spans independently.

- [ ] **Step 5: Run the test and confirm it passes**

Run: `npm test -- src/react/__tests__/Tab.test.tsx`
Expected: PASS

### Task 5: Add Storybook stories for the core usage patterns

**Files:**
- Create: `src/react/Tab.stories.tsx`
- Create: `src/react/TabSection.stories.tsx`

- [ ] **Step 1: Add representative stories**

Include:
- a basic full song
- a chord-only line
- a lyric-heavy section

- [ ] **Step 2: Build Storybook**

Run: `npm run build-storybook`
Expected: the static Storybook build succeeds.

### Task 6: Finalize package metadata and documentation

**Files:**
- Modify: `README.md`
- Modify: `package.json`
- Create: `.gitignore`

- [ ] **Step 1: Document install and usage**

Include:
- npm install
- git URL install
- core usage
- React usage
- Storybook usage

- [ ] **Step 2: Add the final validation pass**

Run:
- `npm run build`
- `npm run build-storybook`
- `npm test`
- `npm run lint`

Expected: all checks pass cleanly.

