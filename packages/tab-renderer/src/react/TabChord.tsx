import type { TabTokenProps } from "./types";

export function TabChord({ token, className }: TabTokenProps) {
	return <span className={className}>{token.text}</span>;
}
