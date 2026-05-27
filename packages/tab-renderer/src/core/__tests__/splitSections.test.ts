import { describe, expect, it } from "vitest";
import { splitSections } from "../parser/splitSections";

describe("splitSections", () => {
  it("splits body into sections with titles", () => {
    const body = `[Verse]\nC\nLine\n\n[Chorus]\nG\nOther`;
    const sections = splitSections(body);
    expect(sections.length).toBeGreaterThanOrEqual(2);
    expect(sections[0].title).toBe("Verse");
    expect(sections[1].title).toBe("Chorus");
  });
});
