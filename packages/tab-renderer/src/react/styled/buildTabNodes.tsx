import { isValidElement, type ReactNode } from "react";
import { chordToText } from "../../core/transposer/chordToText";
import type { BarsListItem, PreparedSection } from "../../core/preparedTypes";
import type { TabStyleConfig } from "../../core/preparedTypes";
import { getChordSpanStyle } from "./chordSpanStyle";

export type TabSectionNodes = {
  title: string | null;
  nodes: ReactNode[];
};

export function buildTabNodes(
  sections: PreparedSection[],
  style: TabStyleConfig,
): TabSectionNodes[] {
  return sections.map((section) => {
    const nodes = section.barList.reduce<ReactNode[]>((prev, curr, index) => {
      appendBarItem(prev, curr, index, style);
      return prev;
    }, []);

    return { title: section.title, nodes };
  });
}

function appendBarItem(
  prev: ReactNode[],
  curr: BarsListItem,
  index: number,
  style: TabStyleConfig,
) {
  if (curr.liricPart && !curr.isSpace) {
    if (style.displayMode === "chords") {
      return;
    }
    prev.push(
      <span
        key={`lyric_${index}`}
        data-nolyricsline={curr.isNoLyricsLine || undefined}
      >
        {curr.liricPart}
      </span>,
    );
    return;
  }

  if (curr.liricPart && curr.isSpace) {
    if (style.displayMode === "chords") {
      return;
    }
    prev.push(
      <span
        key={`space_${index}`}
        style={{ opacity: 0.2 }}
        data-nolyricsline={curr.isNoLyricsLine || undefined}
      >
        {curr.liricPart}
      </span>,
    );
    return;
  }

  if (curr.chordItem) {
    const chordText = chordToText(curr.chordItem.simpleChord);
    if (style.displayMode === "lyrics" || chordText === "/") {
      return;
    }

    const chordStyles = getChordSpanStyle({
      chordText,
      isNoLyricsLine: curr.isNoLyricsLine,
      style,
    });

    prev.push(
      <span
        key={`chord_wrapper_${index}`}
        data-nolyricsline={curr.isNoLyricsLine || undefined}
      >
        <span style={chordStyles}>{chordText}</span>
      </span>,
    );
  }
}

export function nodeIsNoLyricsLine(item: ReactNode): boolean {
  if (!isValidElement(item)) {
    return false;
  }
  return Boolean((item.props as Record<string, unknown>)["data-nolyricsline"]);
}
