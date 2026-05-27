import type { TabSectionProps } from "./types";
import { TabLine } from "./TabLine";

export function TabSection({ section, index, className }: TabSectionProps) {
	return (
		<section className={className} data-section-index={index}>
			{section.title ? <h2>{section.title}</h2> : null}
			{section.lines.map((line, lineIndex) => (
				<TabLine key={lineIndex} line={line} index={lineIndex} />
			))}
		</section>
	);
}
