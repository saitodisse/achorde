# Package Structure and Public API

This project uses a single published npm package with explicit subpath exports. The main entrypoint exports the headless transformation pipeline, while `./react` exports a composable React adapter. This keeps the package easy to consume for non-React users, while still providing a clean UI layer for React applications.

The public contract intentionally separates structure from presentation. The core returns a minimal normalized AST with explicit chord, lyric, and whitespace tokens. The React adapter is compositional and headless by default, so consumers can style or replace individual pieces without inheriting app-specific CSS or layout assumptions.

This structure is chosen over a monolithic widget or split-package monorepo because it keeps the API smaller, preserves reuse across rendering targets, and still allows a convenient `Tab` wrapper for common use cases.

