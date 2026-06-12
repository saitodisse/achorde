# achorde-storybook-config

Configuração compartilhada de Storybook para o monorepo **achorde**.

Segue o padrão descrito na [discussão Turborepo #6879](https://github.com/vercel/turborepo/discussions/6879): um pacote leve tipo `tsconfig` + `.storybook/` mínimo em cada biblioteca que publica stories.

## Uso

```ts
// packages/<lib>/.storybook/main.ts
import { createStorybookMain } from "achorde-storybook-config/vite";

export default createStorybookMain({
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  viteConfigPath: undefined,
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      include: ["../src/**/*.tsx", "../../outro-pacote-workspace/src/**/*.ts"],
    },
  },
});
```

Importe utilitários de runtime apenas pelo entry principal (`achorde-storybook-config`), nunca `achorde-storybook-config/vite` em arquivos de story — o subpath `/vite` é só para `.storybook/main.ts`.

```tsx
// packages/<lib>/.storybook/preview.tsx
import {
  createObservabilityDecorator,
  installStorybookPreviewObservability,
} from "achorde-storybook-config/preview";

installStorybookPreviewObservability("minha-lib");

export default {
  decorators: [createObservabilityDecorator("minha-lib")],
};
```

## O que inclui

- `viteFinal` compatível com Storybook 10 + **Vite 7** (evita iframe 500 `Missing field moduleType`)
- Error boundary nas stories com log `[layer/story-render]`
- `window.error` / `unhandledrejection` → console
- `collectStorybookRuntimeHealth()` para painéis de diagnóstico

## Pacotes com Storybook

| Pacote           | Porta (padrão) | Script raiz                   |
| ---------------- | -------------- | ----------------------------- |
| `tab-renderer`   | 6007           | `pnpm storybook:tab-renderer` |
| `svguitar-react` | 6006           | `pnpm storybook:svguitar`     |
