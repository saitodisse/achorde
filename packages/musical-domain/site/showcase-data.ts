import {
	ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION,
	applyVoicingEditorPipeline,
	formatVoicingToFretNotation,
	inferBarresFromFrettedVoicing,
	normalizeChordSymbolLabel,
	normalizeVoicingDisplayBaseFret,
	parseFretNotationToVoicing,
	resolveVoicingDisplayBaseFret,
	selectPreferredFrettedVoicing,
	spellingFromParsedChordSymbol,
	type ChordChartAst,
	type ChordChartLine,
	type ChordChartSegment,
	type ChordChartSection,
	type FrettedInstrumentBarre,
	type FrettedInstrumentString,
	type FrettedInstrumentVoicing,
	type MusicTheoryAdapter,
	type ParseDiagnostic,
	type ParsedChordChart,
	type ParsedChordSymbol,
	type ParsedTab,
	type ParsedTabLine,
	type ParsedTabSection,
	type ParsedTabToken,
} from "../src/index.js";

export const demoLinks = {
	demo: "https://musical-domain.vercel.app/",
	storybook: "https://storybook-musical-domain.vercel.app/",
	github: "https://github.com/saitodisse/achorde/tree/main/packages/musical-domain",
	npm: "https://www.npmjs.com/package/@achorde/musical-domain",
} as const;

export const learningPath = [
	{
		step: "1",
		title: "Comece pelo nome do acorde",
		summary:
			"Aqui a gente só olha para o símbolo. É a menor peça do pacote e a base para o resto.",
		storybookTitle: "Fundamentos/Símbolo de acorde",
	},
	{
		step: "2",
		title: "Depois vem a linha",
		summary:
			"Uma música tem linhas. Algumas mostram acordes, outras mostram letra. O pacote separa isso direitinho.",
		storybookTitle: "Tab/Linha",
	},
	{
		step: "3",
		title: "A linha vira seção",
		summary:
			"Várias linhas juntas formam uma seção, como verso ou refrão.",
		storybookTitle: "Tab/Seção",
	},
	{
		step: "4",
		title: "Aí aparece a música inteira",
		summary:
			"Com seções, linhas, avisos e acordes encontrados, você tem a visão completa do texto.",
		storybookTitle: "Tab/Tab completa",
	},
	{
		step: "5",
		title: "Por fim entram os acordes no braço do instrumento",
		summary:
			"Esse é o lado mais visual: posições, pestanas, escolha da melhor digitação e desenho final.",
		storybookTitle: "Voicing/Voicing completo",
	},
] as const;

export const contractGroups = [
	{
		title: "Fundamentos",
		items: [
			"ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION",
			"ParseDiagnostic",
			"ParsedChordSymbol",
			"MusicTheoryAdapter",
		],
	},
	{
		title: "Tab",
		items: [
			"ParsedTabToken",
			"ParsedTabLine",
			"ParsedTabSection",
			"ParsedTab",
		],
	},
	{
		title: "Compatibilidade",
		items: [
			"ChordChartSegment",
			"ChordChartLine",
			"ChordChartSection",
			"ChordChartAst",
			"ParsedChordChart",
		],
	},
	{
		title: "Braço e voicing",
		items: [
			"FrettedInstrumentString",
			"FrettedInstrumentBarre",
			"FrettedInstrumentVoicing",
		],
	},
	{
		title: "Ferramentas",
		items: [
			"normalizeChordSymbolLabel",
			"spellingFromParsedChordSymbol",
			"parseFretNotationToVoicing",
			"formatVoicingToFretNotation",
			"selectPreferredFrettedVoicing",
			"inferBarresFromFrettedVoicing",
			"resolveVoicingDisplayBaseFret",
			"normalizeVoicingDisplayBaseFret",
			"applyVoicingEditorPipeline",
		],
	},
] as const;

export const versionExample = ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION;

export const diagnosticExample: ParseDiagnostic = {
	code: "invalid-line",
	message: "Essa linha não parece uma linha válida de acorde.",
	severity: "error",
	line: 3,
	sourceRange: {
		startColumn: 0,
		endColumn: 27,
	},
};

export const parsedChordSymbolExample: ParsedChordSymbol = {
	kind: "chord",
	text: "C#maj7",
	root: "C#",
	suffix: "maj7",
};

export const parsedChordSymbolWithBassExample: ParsedChordSymbol = {
	kind: "chord",
	text: "Am/G",
	root: "A",
	suffix: "m",
	bass: "G",
};

export const theoryAdapterExample: MusicTheoryAdapter = {
	transposePitchClass(note, semitones) {
		const sign = semitones >= 0 ? "+" : "";
		return `${note}${sign}${semitones}`;
	},
	parseChordSymbol(symbol) {
		return symbol.trim()
			? {
					kind: "chord",
					text: symbol,
					root: symbol[0] ?? "C",
					suffix: symbol.slice(1),
				}
			: null;
	},
	getChordNotes(symbol) {
		return [symbol];
	},
	detectChord(notes) {
		return notes.length > 0 ? [notes[0] ?? ""] : [];
	},
};

export const tabTokenExample: ParsedTabToken = {
	kind: "ChordToken",
	text: "G7",
	startColumn: 0,
	endColumn: 2,
	chord: {
		kind: "chord",
		text: "G7",
		root: "G",
		suffix: "7",
	},
};

export const tabDecorationTokenExample: ParsedTabToken = {
	kind: "DecorationToken",
	text: "(",
	startColumn: 0,
	endColumn: 1,
};

export const tabLyricTokenExample: ParsedTabToken = {
	kind: "LyricToken",
	text: "Você",
	startColumn: 0,
	endColumn: 4,
};

export const tabLineExample: ParsedTabLine = {
	id: "section-1-line-2",
	order: 1,
	text: "C         G7",
	kind: "chords",
	tokens: [
		{
			kind: "ChordToken",
			text: "C",
			startColumn: 0,
			endColumn: 1,
			chord: {
				kind: "chord",
				text: "C",
				root: "C",
				suffix: "",
			},
		},
		{
			kind: "SpaceToken",
			text: "         ",
			startColumn: 1,
			endColumn: 10,
		},
		{
			kind: "ChordToken",
			text: "G7",
			startColumn: 10,
			endColumn: 12,
			chord: {
				kind: "chord",
				text: "G7",
				root: "G",
				suffix: "7",
			},
		},
	],
};

export const tabSectionExample: ParsedTabSection = {
	id: "section-1",
	order: 0,
	title: "Verso",
	originalTitle: "Verso",
	lines: [
		{
			id: "section-1-line-1",
			order: 0,
			text: "[Verso]",
			kind: "section-header",
			tokens: [],
		},
		tabLineExample,
		{
			id: "section-1-line-3",
			order: 2,
			text: "A letra continua aqui",
			kind: "lyrics",
			tokens: [
				{
					kind: "LyricToken",
					text: "A",
					startColumn: 0,
					endColumn: 1,
				},
				{
					kind: "SpaceToken",
					text: " ",
					startColumn: 1,
					endColumn: 2,
				},
				{
					kind: "LyricToken",
					text: "letra",
					startColumn: 2,
					endColumn: 7,
				},
				{
					kind: "SpaceToken",
					text: " ",
					startColumn: 7,
					endColumn: 8,
				},
				{
					kind: "LyricToken",
					text: "continua",
					startColumn: 8,
					endColumn: 16,
				},
				{
					kind: "SpaceToken",
					text: " ",
					startColumn: 16,
					endColumn: 17,
				},
				{
					kind: "LyricToken",
					text: "aqui",
					startColumn: 17,
					endColumn: 21,
				},
			],
		},
	],
};

export const parsedTabExample: ParsedTab = {
	body: "[Verso]\nC         G7\nA letra continua aqui",
	sections: [tabSectionExample],
	diagnostics: [diagnosticExample],
	parserVersion: "2.2.2",
	astVersion: "2.2.2",
	chordsFound: ["C", "G7"],
};

export const legacySegmentExample: ChordChartSegment = {
	id: "legacy-segment-1",
	order: 0,
	text: "C",
	chord: "C",
	sourceRange: {
		startColumn: 0,
		endColumn: 1,
	},
};

export const legacyLineExample: ChordChartLine = {
	id: "legacy-line-1",
	order: 0,
	raw: "C  G7",
	kind: "chords",
	segments: [
		legacySegmentExample,
		{
			id: "legacy-segment-2",
			order: 1,
			text: "G7",
			chord: "G7",
			sourceRange: {
				startColumn: 3,
				endColumn: 5,
			},
		},
	],
};

export const legacySectionExample: ChordChartSection = {
	id: "legacy-section-1",
	order: 0,
	kind: "verse",
	label: "Verso",
	originalLabel: "Verso",
	lines: [legacyLineExample],
};

export const legacyChordChartExample: ParsedChordChart = {
	sections: [legacySectionExample],
	diagnostics: [diagnosticExample],
};

export const legacyChordChartAstExample: ChordChartAst = {
	sections: [legacySectionExample],
};

export const fretStringExample: FrettedInstrumentString = {
	stringIndex: 5,
	openNote: "A2",
	fret: 3,
	state: "fretted",
	finger: 3,
	label: "3",
};

export const barreExample: FrettedInstrumentBarre = {
	fret: 1,
	fromStringIndex: 1,
	toStringIndex: 6,
	finger: 1,
};

export const voicingExample: FrettedInstrumentVoicing = parseFretNotationToVoicing({
	fretNotation: "x32010",
	chordSymbol: "C",
	id: "voicing-c-major",
})!;

export const voicingWithBarreExample: FrettedInstrumentVoicing = {
	id: "voicing-f-major",
	instrumentId: "guitar",
	tuningId: "guitar-standard-eadgbe",
	chordSymbol: "F",
	strings: [
		{ stringIndex: 1, openNote: "E2", fret: 1, state: "fretted", finger: 1 },
		{ stringIndex: 2, openNote: "A2", fret: 3, state: "fretted", finger: 3 },
		{ stringIndex: 3, openNote: "D3", fret: 3, state: "fretted", finger: 4 },
		{ stringIndex: 4, openNote: "G3", fret: 2, state: "fretted", finger: 2 },
		{ stringIndex: 5, openNote: "B3", fret: 1, state: "fretted", finger: 1 },
		{ stringIndex: 6, openNote: "E4", fret: 1, state: "fretted", finger: 1 },
	],
	barres: [barreExample],
	baseFret: 1,
	source: "manual",
	quality: "exact",
};

export const sampleVoicings: FrettedInstrumentVoicing[] = [
	voicingExample,
	parseFretNotationToVoicing({
		fretNotation: "xx0232",
		chordSymbol: "D",
		id: "voicing-d-major",
	})!,
	{
		...voicingWithBarreExample,
		id: "voicing-f-major-variant",
		baseFret: 1,
		quality: "recommended",
	},
];

export const preferredVoicingExample = selectPreferredFrettedVoicing(sampleVoicings)!;

export const fretNotationExample = {
	input: "x32010",
	voicing: voicingExample,
	formatted: formatVoicingToFretNotation(voicingExample),
};

export const normalizedLabelExample = normalizeChordSymbolLabel("C♯maj7");

export const chordSpellingExample = spellingFromParsedChordSymbol(
	parsedChordSymbolExample,
);

export const displayBaseFretExample = {
	voicing: {
		...voicingWithBarreExample,
		baseFret: 5,
		strings: [
			{ stringIndex: 1, openNote: "E2", fret: null, state: "muted" },
			{ stringIndex: 2, openNote: "A2", fret: null, state: "muted" },
			{ stringIndex: 3, openNote: "D3", fret: 5, state: "fretted" },
			{ stringIndex: 4, openNote: "G3", fret: 5, state: "fretted" },
			{ stringIndex: 5, openNote: "B3", fret: 5, state: "fretted" },
			{ stringIndex: 6, openNote: "E4", fret: 7, state: "fretted" },
		],
	},
	result: resolveVoicingDisplayBaseFret(
		{
			...voicingWithBarreExample,
			baseFret: 5,
			strings: [
				{ stringIndex: 1, openNote: "E2", fret: null, state: "muted" },
				{ stringIndex: 2, openNote: "A2", fret: null, state: "muted" },
				{ stringIndex: 3, openNote: "D3", fret: 5, state: "fretted" },
				{ stringIndex: 4, openNote: "G3", fret: 5, state: "fretted" },
				{ stringIndex: 5, openNote: "B3", fret: 5, state: "fretted" },
				{ stringIndex: 6, openNote: "E4", fret: 7, state: "fretted" },
			],
		},
		5,
	),
};

export const barreInferenceExample = {
	input: {
		...voicingWithBarreExample,
		barres: [],
	},
	output: inferBarresFromFrettedVoicing({
		...voicingWithBarreExample,
		barres: [],
	}),
};

export const editorPipelineExample = applyVoicingEditorPipeline({
	...voicingWithBarreExample,
	barres: [],
	baseFret: 5,
});

export const normalizedPipelineExample = normalizeVoicingDisplayBaseFret(
	editorPipelineExample,
);
