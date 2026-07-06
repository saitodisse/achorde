import { parseTab, type ParseDiagnostic, type ParsedTab } from "@achorde/tab-renderer";

export type ChordChartAnalysisStatus = "valid" | "warning" | "invalid";

export type ChordChartTextAnalysis = {
  parsed: ParsedTab;
  diagnostics: ReadonlyArray<ParseDiagnostic>;
  status: ChordChartAnalysisStatus;
  chordsFound: ReadonlyArray<string>;
  isValid: boolean;
};

export type ChordChartSavePayload = ChordChartTextAnalysis & {
  value: string;
  originalValue?: string;
  title?: string;
  sourceKey?: string;
  hasChanges: boolean;
};

export type TextChangeProposalInput = {
  path: string;
  before: string;
  after: string;
};

export type TextChangeProposal = TextChangeProposalInput & {
  summary: string;
  hasChanges: boolean;
};

export function analyzeChordChartText(rawText: string): ChordChartTextAnalysis {
  const parsed = parseTab(rawText);
  const diagnostics = parsed.diagnostics;
  const hasErrors = diagnostics.some((diagnostic) => diagnostic.severity === "error");
  const status: ChordChartAnalysisStatus = hasErrors
    ? "invalid"
    : diagnostics.length > 0
      ? "warning"
      : "valid";

  return {
    parsed,
    diagnostics,
    status,
    chordsFound: parsed.chordsFound,
    isValid: !hasErrors,
  };
}

export function createTextChangeProposal({
  path,
  before,
  after,
}: TextChangeProposalInput): TextChangeProposal {
  const hasChanges = before !== after;
  return {
    path,
    before,
    after,
    hasChanges,
    summary: hasChanges
      ? `Update chord chart at ${path}.`
      : `No changes for chord chart at ${path}.`,
  };
}
