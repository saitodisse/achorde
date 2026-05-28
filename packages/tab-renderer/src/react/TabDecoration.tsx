import type { TabTokenProps } from "./types";

export function TabDecoration({ token, className }: TabTokenProps) {
  return (
    <span
      className={className ?? "tab-decoration"}
      data-token-kind="decoration"
    >
      {token.text}
    </span>
  );
}
