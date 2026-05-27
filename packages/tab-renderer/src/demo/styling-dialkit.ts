import { DEFAULT_TAB_STYLE, type TabStyleConfig } from "../core/preparedTypes";
import { DialStore, type DialConfig, type ResolvedValues } from "dialkit";

export const TAB_STYLING_PANEL_NAME = "Tab styling";

export type AppPageTheme = "light" | "dark";

function slider(
  defaultValue: number,
  min: number,
  max: number,
  step: number,
): [number, number, number, number] {
  return [defaultValue, min, max, step];
}

export const defaultLightStylingPreset: TabStyleConfig = {
  fontSize: 21,
  viewMode: "e",
  transposeNumber: 0,
  lineHeight: 0.184,
  chordColor: "#1d57f7",
  lyricColor: "#1b2027",
  backgroundColor: "#ffffff",
  chordHeight: 0.07,
  blockMarginRight: 0.575,
  displayMode: "both",
  contentMarginRightPx: 0,
  sectionGap: 24,
  sectionTitleColor: "#556677",
  sectionTitleFontSize: 14,
};

export const defaultDarkStylingPreset: TabStyleConfig = {
  ...DEFAULT_TAB_STYLE,
};

const onlyLyricsStylingBase = {
  fontSize: 21,
  lineHeight: 0.06,
  chordHeight: 0.07,
  blockMarginRight: 0.575,
  displayMode: "lyrics" as const,
  viewMode: "o" as const,
  transposeNumber: 0,
  contentMarginRightPx: 0,
  sectionGap: 24,
  sectionTitleFontSize: 14,
};

export const onlyLyricsLightStylingPreset: TabStyleConfig = {
  ...onlyLyricsStylingBase,
  chordColor: "#1d57f7",
  lyricColor: "#1b2027",
  backgroundColor: "#ffffff",
  sectionTitleColor: "#556677",
};

export const onlyLyricsDarkStylingPreset: TabStyleConfig = {
  ...onlyLyricsStylingBase,
  chordColor: "#5884fe",
  lyricColor: "#d1dff5",
  backgroundColor: "#000000",
  sectionTitleColor: "#8899aa",
};

export function applyStylingPreset(preset: TabStyleConfig) {
  const panel = DialStore.getPanels().find(
    (entry) => entry.name === TAB_STYLING_PANEL_NAME,
  );
  if (!panel) return;

  for (const [key, value] of Object.entries(preset)) {
    DialStore.updateValue(panel.id, key, value);
  }
}

export function handleStylingPresetAction(
  path: string,
): AppPageTheme | undefined {
  if (path === "presets.applyDefaultLight") {
    applyStylingPreset(defaultLightStylingPreset);
    return "light";
  }

  if (path === "presets.applyDefaultDark") {
    applyStylingPreset(defaultDarkStylingPreset);
    return "dark";
  }

  if (path === "presets.applyOnlyLyricsLight") {
    applyStylingPreset(onlyLyricsLightStylingPreset);
    return "light";
  }

  if (path === "presets.applyOnlyLyricsDark") {
    applyStylingPreset(onlyLyricsDarkStylingPreset);
    return "dark";
  }

  return undefined;
}

/** DialKit config mirroring `components/07-styling/styling-argtypes.ts` ranges. */
export const stylingDialkitConfig = {
  presets: {
    applyDefaultLight: { type: "action", label: "Default: light" },
    applyDefaultDark: { type: "action", label: "Default: dark" },
    applyOnlyLyricsLight: { type: "action", label: "Only lyrics: light" },
    applyOnlyLyricsDark: { type: "action", label: "Only lyrics: dark" },
  },
  fontSize: slider(defaultLightStylingPreset.fontSize, 10, 40, 1),
  viewMode: {
    type: "select",
    options: [
      { value: "o", label: "Original" },
      { value: "e", label: "Extended" },
    ],
    default: defaultLightStylingPreset.viewMode,
  },
  transposeNumber: slider(
    defaultLightStylingPreset.transposeNumber,
    -11,
    11,
    1,
  ),
  lineHeight: slider(defaultLightStylingPreset.lineHeight, 0, 1, 0.01),
  chordColor: defaultLightStylingPreset.chordColor,
  lyricColor: defaultLightStylingPreset.lyricColor,
  backgroundColor: defaultLightStylingPreset.backgroundColor,
  chordHeight: slider(defaultLightStylingPreset.chordHeight, 0, 0.3, 0.001),
  blockMarginRight: slider(
    defaultLightStylingPreset.blockMarginRight,
    0,
    2,
    0.001,
  ),
  displayMode: {
    type: "select",
    options: ["both", "chords", "lyrics"],
    default: defaultLightStylingPreset.displayMode,
  },
  contentMarginRightPx: slider(
    defaultLightStylingPreset.contentMarginRightPx,
    0,
    1000,
    20,
  ),
  sectionGap: slider(defaultLightStylingPreset.sectionGap, 0, 80, 1),
  sectionTitleColor: defaultLightStylingPreset.sectionTitleColor,
  sectionTitleFontSize: slider(
    defaultLightStylingPreset.sectionTitleFontSize,
    8,
    32,
    1,
  ),
} satisfies DialConfig;

export function stylingDialToTabStyle(
  dial: ResolvedValues<typeof stylingDialkitConfig>,
): TabStyleConfig {
  return {
    fontSize: dial.fontSize,
    lineHeight: dial.lineHeight,
    chordColor: dial.chordColor,
    lyricColor: dial.lyricColor,
    backgroundColor: dial.backgroundColor,
    chordHeight: dial.chordHeight,
    blockMarginRight: dial.blockMarginRight,
    displayMode: dial.displayMode as TabStyleConfig["displayMode"],
    viewMode: dial.viewMode as TabStyleConfig["viewMode"],
    transposeNumber: dial.transposeNumber,
    contentMarginRightPx: dial.contentMarginRightPx,
    sectionGap: dial.sectionGap,
    sectionTitleColor: dial.sectionTitleColor,
    sectionTitleFontSize: dial.sectionTitleFontSize,
  };
}
