import {
	ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION,
	formatVoicingToFretNotation,
	normalizeChordSymbolLabel,
	parseFretNotationToVoicing,
	resolveVoicingDisplayBaseFret,
	selectPreferredFrettedVoicing,
	type FrettedInstrumentVoicing,
} from "../src/index.js";

export const demoLinks = {
	demo: "https://musical-domain.vercel.app/",
	storybook: "https://storybook-musical-domain.vercel.app/",
	npm: "https://www.npmjs.com/package/@achorde/musical-domain",
} as const;

export const exportedGroups = [
	{
		title: "Tab contracts",
		items: [
			"ParsedTab",
			"ParsedTabSection",
			"ParsedTabLine",
			"ParsedTabToken",
			"ParseDiagnostic",
		],
	},
	{
		title: "Chord helpers",
		items: ["ParsedChordSymbol", "normalizeChordSymbolLabel", "ChordSpellingMetadata"],
	},
	{
		title: "Voicing helpers",
		items: [
			"FrettedInstrumentVoicing",
			"parseFretNotationToVoicing",
			"formatVoicingToFretNotation",
			"compareFrettedVoicings",
			"selectPreferredFrettedVoicing",
			"resolveVoicingDisplayBaseFret",
		],
	},
];

const sampleVoicings: FrettedInstrumentVoicing[] = [
	parseFretNotationToVoicing({
		fretNotation: "x32010",
		chordSymbol: "C",
		id: "c-major",
	})!,
	parseFretNotationToVoicing({
		fretNotation: "xx0232",
		chordSymbol: "D",
		id: "d-major",
	})!,
	parseFretNotationToVoicing({
		fretNotation: "133211",
		chordSymbol: "F",
		id: "f-major",
	})!,
];

export const sampleData = {
	contractVersion: ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION,
	normalizedLabel: normalizeChordSymbolLabel("C♯maj7"),
	voicing: sampleVoicings[0]!,
	notation: "x32010",
	recoveredNotation: formatVoicingToFretNotation(sampleVoicings[0]!),
	preferredVoicing: selectPreferredFrettedVoicing(sampleVoicings)!,
	displayBaseFret: resolveVoicingDisplayBaseFret(sampleVoicings[2]!, 5),
	tabExample: {
		body: "[Verse]\\nC\\nLine of lyrics",
		chordsFound: ["C"],
		preview: "Section header + chord line + lyric line",
	},
};
