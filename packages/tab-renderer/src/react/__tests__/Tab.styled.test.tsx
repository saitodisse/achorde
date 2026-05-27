import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tab } from "../Tab";

const body = `[Verse]
C   G
Minha letra`;

describe("Tab styled viewer", () => {
  it("hides lyric segments when displayMode is chords", () => {
    render(<Tab body={body} style={{ displayMode: "chords" }} />);
    expect(screen.queryByText(/Minha/)).toBeNull();
    expect(screen.getAllByText("C").length).toBeGreaterThan(0);
  });

  it("hides chord segments when displayMode is lyrics", () => {
    const { container } = render(
      <Tab body={body} style={{ displayMode: "lyrics" }} />,
    );
    expect(container.textContent).toContain("Minha");
    expect(container.textContent).not.toMatch(/\bC\b.*\bG\b/);
  });

  it("applies chord offset styles", () => {
    const { container } = render(
      <Tab
        body={body}
        style={{
          chordHeight: 0.1,
          blockMarginRight: 0.6,
          fontSize: 21,
        }}
      />,
    );
    const chordSpan = [
      ...container.querySelectorAll("[data-tab-root] span span"),
    ].find((el) => el.getAttribute("style")?.includes("bottom"));
    expect(chordSpan?.getAttribute("style")).toMatch(/bottom:/);
    expect(chordSpan?.getAttribute("style")).toMatch(/margin-right:\s*-/);
  });

  it("applies content margin on container", () => {
    const { container } = render(
      <Tab body={body} style={{ contentMarginRightPx: 300 }} />,
    );
    const root = container.querySelector("[data-tab-root]") as HTMLElement;
    expect(root.style.marginRight).toBe("300px");
  });
});
