import type { BarsList, SectionBarList, SectionText } from "../parser/types";

export function generateBarList({
  sectionTexts,
  barSuffix = "",
}: {
  sectionTexts: SectionText[];
  barSuffix?: string;
}): SectionBarList[] {
  return sectionTexts.map((sectionText) => {
    const lines = sectionText?.lines?.reduce<BarsList>(
      (finalArray, barLine) => {
        if (!barLine.chordsList) {
          finalArray.push({ isSpace: true });
          return finalArray;
        }

        const isNoLyricsLine =
          !barLine.liricsTextBar || !barLine.liricsTextBar.trim();

        if (barLine.chordsList.length === 0) {
          finalArray.push({
            liricPart: barLine.liricsTextBar,
            isNoLyricsLine,
          });

          const finalBarSuffix = isNoLyricsLine
            ? barSuffix.replace(/\./g, " ")
            : barSuffix;
          finalArray.push({
            liricPart: finalBarSuffix,
            isSpace: true,
            isNoLyricsLine,
          });
          return finalArray;
        }

        const liricsText = barLine.liricsTextBar;
        let lastIndex = 0;

        const parts = barLine.chordsList.reduce<BarsList>(
          (prev, currentChordItem, chordIndex) => {
            if (chordIndex === 0) {
              prev.push({
                liricPart: liricsText?.substring(
                  0,
                  currentChordItem?.chordPosition,
                ),
                isNoLyricsLine,
              });
              prev.push({
                chordItem: currentChordItem,
                isNoLyricsLine,
              });
              lastIndex = currentChordItem.chordPosition!;
            } else {
              prev.push({
                liricPart: liricsText?.substring(
                  lastIndex,
                  currentChordItem?.chordPosition,
                ),
                isNoLyricsLine,
              });
              prev.push({
                chordItem: currentChordItem,
                isNoLyricsLine,
              });
              lastIndex = currentChordItem?.chordPosition ?? 0;
            }

            const isLastChord =
              chordIndex === (barLine?.chordsList?.length || 0) - 1;
            if (isLastChord) {
              const lastLiricPart = barLine.liricsTextBar?.substring(
                lastIndex,
                barLine.liricsTextBar?.length + barSuffix.length,
              );
              prev.push({
                liricPart: lastLiricPart,
                isNoLyricsLine,
              });

              const finalBarSuffix = isNoLyricsLine
                ? barSuffix.replace(/\./g, " ")
                : barSuffix;
              prev.push({
                liricPart: finalBarSuffix,
                isSpace: true,
                isNoLyricsLine,
              });
            }

            return prev;
          },
          [],
        );

        finalArray.push(...parts);
        return finalArray;
      },
      [],
    );

    return {
      content: sectionText.content,
      title: sectionText.title,
      barList: lines?.flat() ?? [],
    };
  });
}
