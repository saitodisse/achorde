import React from "react";
import type { Decorator, Preview } from "@storybook/react-vite";
import { StorybookErrorBoundary } from "./StorybookErrorBoundary.tsx";
import {
  collectStorybookRuntimeHealth,
  logStorybookRuntimeHealth,
} from "./runtimeHealth.ts";

export function createObservabilityDecorator(layer: string): Decorator {
  return (Story) => (
    <StorybookErrorBoundary layer={layer}>
      <Story />
    </StorybookErrorBoundary>
  );
}

export function installStorybookPreviewObservability(layer: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const health = collectStorybookRuntimeHealth();
  logStorybookRuntimeHealth(layer, health);

  window.addEventListener("error", (event) => {
    console.error(`[${layer}/window-error]`, {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error(`[${layer}/unhandled-rejection]`, {
      reason: event.reason,
    });
  });
}

export const basePreviewParameters: Preview["parameters"] = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
};
