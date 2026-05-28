import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tab } from "../Tab";

describe("Tab interleaved renderer (ParsedTab pipeline)", () => {
  it("renders chords with blockMarginRight offset above lyrics", () => {
    const body = `[Verse]
C   G
Minha letra`;

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

  it("includes decoration parentheses in the interleaved stream", () => {
    const body = [
      "                  (C7        B7)       Em7",
      "Mas hoje eu quero o simples toque da tua mão",
    ].join("\n");

    const { container } = render(<Tab body={body} />);
    expect(container.textContent).toContain("(");
    expect(container.textContent).toContain("C7");
    expect(container.textContent).toContain("B7");
    expect(container.textContent).toContain(")");
    expect(container.textContent).toContain("Mas hoje eu quero");
  });

  it("renders slash and parenthetical extensions inside chord spans", () => {
    const body = [
      "      Am7        D7/9         Gmaj7",
      "Logo agora que eu já me fiz primeiro",
    ].join("\n");

    const { container } = render(<Tab body={body} />);
    expect(container.textContent).toContain("D7/9");
    expect(container.textContent).toContain("Am7");
  });
});
