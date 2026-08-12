# @achorde/storybook-config

Private workspace helpers shared by Achorde Storybook projects. This package is not published to npm.

## Vite configuration

```ts
// packages/<library>/.storybook/main.ts
import { createStorybookMain } from "@achorde/storybook-config/vite";

export default createStorybookMain({
  stories: ["../src/**/*.stories.@(ts|tsx)"],
});
```

Use the `/vite` entrypoint only from Storybook configuration.

## Preview observability

```tsx
// packages/<library>/.storybook/preview.tsx
import {
  createObservabilityDecorator,
  installStorybookPreviewObservability,
} from "@achorde/storybook-config/preview";

installStorybookPreviewObservability("my-library");

export default {
  decorators: [createObservabilityDecorator("my-library")],
};
```

The helpers provide Storybook 10 and Vite 7 setup, story error boundaries, browser error logging, and runtime health collection.

## Storybook ports

| Package | Port | Root command |
| --- | ---: | --- |
| `tab-renderer` | 6007 | `pnpm storybook:tab-renderer` |
| `tab-editor` | 6012 | `pnpm storybook:tab-editor` |
| `svguitar-react` | 6006 | `pnpm storybook:svguitar` |
| `interactive-fretboard` | 6010 | `pnpm storybook:interactive-fretboard` |
