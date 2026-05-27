export type ParsedChordSymbol =
  | {
      kind: "repeat";
      text: "/";
    }
  | {
      kind: "chord";
      text: string;
      root: string;
      suffix: string;
      bass?: string;
    };

