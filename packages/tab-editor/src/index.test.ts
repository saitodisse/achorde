import { describe, expect, it } from "vitest";
import { analyzeChordChartText, createTextChangeProposal } from "./index";

describe("analyzeChordChartText", () => {
  it("returns parser output, diagnostics, status, and diagrammable chords", () => {
    const analysis = analyzeChordChartText("[Verse]\nC        G\nCidade acordou\n");

    expect(analysis.isValid).toBe(true);
    expect(analysis.status).toBe("valid");
    expect(analysis.chordsFound).toEqual(["C", "G"]);
    expect(analysis.parsed.sections).toHaveLength(1);
    expect(analysis.diagnostics).toHaveLength(0);
  });

  it("marks parser errors as invalid", () => {
    const analysis = analyzeChordChartText("E|--0--\n");

    expect(analysis.isValid).toBe(false);
    expect(analysis.status).toBe("invalid");
    expect(analysis.diagnostics[0]?.code).toBe("invalid-line");
  });
});

describe("createTextChangeProposal", () => {
  it("summarizes changed text", () => {
    const proposal = createTextChangeProposal({
      path: "catalog/charts/song/demo.md",
      before: "C\n",
      after: "G\n",
    });

    expect(proposal.hasChanges).toBe(true);
    expect(proposal.summary).toContain("catalog/charts/song/demo.md");
  });
});
