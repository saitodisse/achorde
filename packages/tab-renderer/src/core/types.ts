export type {
  ParseDiagnostic,
  ParseDiagnosticSeverity,
  ParsedChordSymbol,
  ParsedTabLine,
  ParsedTabLineKind,
  ParsedTabSection,
  ParsedTabToken,
  ParsedTabTokenKind,
} from "achorde-musical-domain";

import type { ParsedTab as DomainParsedTab } from "achorde-musical-domain";

export type ParsedTab = DomainParsedTab & {
  chordsFound: ReadonlyArray<string>;
};
