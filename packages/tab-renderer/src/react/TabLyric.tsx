import type { TabTokenProps } from "./types";

export function TabLyric({ token, className }: TabTokenProps) {
	return <span className={className}>{token.text}</span>;
}
