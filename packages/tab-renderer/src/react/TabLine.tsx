import type { TabLineProps } from "./types";
import { TabChord } from "./TabChord";
import { TabLyric } from "./TabLyric";

export function TabLine({ line, className }: TabLineProps) {
	return (
		<div className={className} style={{ whiteSpace: "pre" }}>
			{line.tokens.map((token, tokenIndex) => {
				switch (token.kind) {
					case "ChordToken":
						return <TabChord key={tokenIndex} token={token} />;
					case "LyricToken":
						return <TabLyric key={tokenIndex} token={token} />;
					default:
						return <span key={tokenIndex}>{token.text}</span>;
				}
			})}
		</div>
	);
}
