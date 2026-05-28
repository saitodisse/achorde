export type StorybookRuntimeHealth = {
  checkedAt: string;
  storybookVersion?: string;
  viteVersion?: string;
  mode?: string;
  location?: string;
  userAgent?: string;
  issues: string[];
  hints: string[];
};

export function collectStorybookRuntimeHealth(): StorybookRuntimeHealth {
  const issues: string[] = [];
  const hints: string[] = [];

  const viteVersion = import.meta.env?.VITE_VERSION ?? undefined;

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("viewMode") === "story" && !params.get("id")) {
      issues.push("iframe sem parâmetro id= — story não selecionada.");
    }
  }

  if (viteVersion?.startsWith("8.")) {
    issues.push(
      "Vite 8 (Rolldown) pode causar iframe.html 500 (Missing field moduleType). Use Vite 7 no pacote.",
    );
    hints.push(
      "pnpm why vite — deve resolver para 7.x no pacote do Storybook.",
    );
  }

  return {
    checkedAt: new Date().toISOString(),
    viteVersion: viteVersion ?? "(unknown)",
    mode: import.meta.env?.MODE,
    location: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    issues,
    hints,
  };
}

export function logStorybookRuntimeHealth(
  layer: string,
  health: StorybookRuntimeHealth,
): void {
  const label = `[${layer}/storybook-health]`;
  if (health.issues.length === 0) {
    console.info(label, health);
    return;
  }
  console.warn(label, health);
}
