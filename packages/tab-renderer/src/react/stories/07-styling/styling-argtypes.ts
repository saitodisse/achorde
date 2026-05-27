import type { TabStyleConfig } from "../../types";
import { DEFAULT_TAB_STYLE } from "../../styled/defaultTabStyle";

export type StylingStoryArgs = {
  body: string;
} & TabStyleConfig;

export const stylingFieldArgTypes = {
  fontSize: {
    control: { type: "number" as const, min: 10, max: 40, step: 1 },
  },
  lineHeight: {
    control: { type: "number" as const, min: 0.1, max: 1, step: 0.01 },
  },
  chordColor: { control: "color" as const },
  lyricColor: { control: "color" as const },
  backgroundColor: { control: "color" as const },
  chordHeight: {
    control: { type: "number" as const, min: 0, max: 0.3, step: 0.01 },
  },
  blockMarginRight: {
    control: { type: "number" as const, min: 0, max: 2, step: 0.1 },
  },
  displayMode: {
    control: "radio" as const,
    options: ["both", "chords", "lyrics"],
  },
  viewMode: {
    control: "radio" as const,
    options: ["o", "e"],
  },
  transposeNumber: {
    control: { type: "number" as const, min: -11, max: 11, step: 1 },
  },
  contentMarginRightPx: {
    control: { type: "number" as const, min: 0, max: 1000, step: 20 },
  },
};

export const defaultStylingArgs: StylingStoryArgs = {
  body: "",
  ...DEFAULT_TAB_STYLE,
};

export function stylingArgsToTabProps(
  args: StylingStoryArgs,
  overrides: Partial<TabStyleConfig> = {},
) {
  const { body, ...style } = args;
  return {
    body,
    style: { ...style, ...overrides },
  };
}
