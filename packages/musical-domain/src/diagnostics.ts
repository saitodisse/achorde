export type ParseDiagnosticSeverity = "info" | "warning" | "error";

export type ParseDiagnostic = {
  code: string;
  message: string;
  severity: ParseDiagnosticSeverity;
  line?: number;
  column?: number;
  sourceRange?: {
    startColumn: number;
    endColumn: number;
  };
};

