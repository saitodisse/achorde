import type { SectionText } from "./types";

export function splitSections(originalText: string): SectionText[] {
  const textSections = originalText.split(/(\r\n|\n){2,}/);

  const splitedSections = textSections.map((section) => {
    const titleMatch = section.match(/^[ \t]*\[(.*?)\]/m);
    const title = titleMatch?.[1] || null;

    let content = section.replace(/^[ \t]*\[(.*?)\]/m, "");
    content = content.trimEnd();

    return { title, content };
  });

  return splitedSections.filter((section) => section.content !== "");
}
