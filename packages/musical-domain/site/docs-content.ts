export type Locale = "pt-BR" | "en";
export type RouteLocale = "pt-br" | "en";

export type PackageId =
	| "musical-domain"
	| "source-catalog"
	| "tab-renderer"
	| "svguitar-react"
	| "interactive-fretboard"
	| "storybook-config";

export type PackageDoc = {
	id: PackageId;
	name: string;
	scope: "contracts" | "rendering" | "editor" | "infrastructure";
	npm?: string;
	demo?: string;
	storybook?: string;
	github: string;
	summary: Record<Locale, {
		label: string;
		headline: string;
		paragraph: string;
		steps: string[];
		whenToUse: string;
		remember: string;
	}>;
};

export type PackageSpecificConceptDoc = {
	id: string;
	source: string;
	copy: Record<Locale, {
		label: string;
		title: string;
		summary: string;
		whyItMatters: string;
		steps: string[];
		code: string;
		memoryPrompt: string;
		nextQuestion: string;
	}>;
};

export type PackageConceptDoc = PackageSpecificConceptDoc & {
	packageId: PackageId;
};

export const locales = {
	"pt-BR": {
		route: "pt-br",
		label: "Português",
		shortLabel: "PT-BR",
	},
	en: {
		route: "en",
		label: "English",
		shortLabel: "EN",
	},
} as const satisfies Record<Locale, {
	route: RouteLocale;
	label: string;
	shortLabel: string;
}>;

export const siteCopy = {
	"pt-BR": {
		title: "ACHORDE Docs",
		kicker: "Documentação geral",
		headline: "Entenda o ACHORDE por pacote, sem pular etapas.",
		intro:
			"ACHORDE é um conjunto de pacotes para representar, renderizar e editar músicas com acordes. Cada página abaixo ensina uma parte em três níveis: manchete, um parágrafo e passo a passo.",
		allPackages: "Todos os pacotes",
		startHere: "Comece aqui",
		startHereText:
			"Leia primeiro o pacote de contratos. Depois siga para parser/renderização, desenho de diagramas, edição interativa e infraestrutura.",
		packageRoutes: "Rotas por pacote",
		packageRoutesText:
			"Cada rota tem uma explicação fácil e cumulativa. A ideia é você conseguir lembrar o papel de cada pacote antes de olhar a API.",
		levelsTitle: "Três níveis de explicação",
		headlineLabel: "Manchete",
		paragraphLabel: "Um parágrafo",
		stepsLabel: "Passo a passo",
		whenToUseLabel: "Quando usar",
		rememberLabel: "Lembre assim",
		openDemo: "Demo",
		openStorybook: "Storybook",
		openNpm: "npm",
		openGithub: "GitHub",
		language: "Idioma",
		notFound: "Pacote não encontrado",
		notFoundText: "Escolha um pacote na navegação lateral para continuar.",
		retrievalTitle: "Teste rápido de memória",
		retrievalPrompt:
			"Antes de seguir, tente responder sem olhar: este pacote guarda dados, desenha algo ou coordena ferramentas?",
		readmeLabel: "README do pacote",
		readmeLoading: "Preparando Markdown e syntax highlighting...",
		coreConceptsTitle: "Conceitos centrais",
		coreConceptsText:
			"Cada rota abaixo ensina uma peça central deste pacote. Abra uma por vez e tente explicar a peça antes de olhar o código.",
		conceptRoutes: "Rotas por conceito",
		whyItMattersLabel: "Por que importa",
		sourceLabel: "Fonte",
		nextQuestionLabel: "Pergunte ao agente",
		backToPackage: "Voltar ao pacote",
	},
	en: {
		title: "ACHORDE Docs",
		kicker: "General documentation",
		headline: "Understand ACHORDE package by package, one step at a time.",
		intro:
			"ACHORDE is a set of packages for representing, rendering, and editing chord-based music. Each page teaches one part at three levels: headline, one paragraph, and step by step.",
		allPackages: "All packages",
		startHere: "Start here",
		startHereText:
			"Read the contracts package first. Then move through parsing/rendering, diagram drawing, interactive editing, and infrastructure.",
		packageRoutes: "Package routes",
		packageRoutesText:
			"Each route gives a simple cumulative explanation. The goal is to remember each package role before reading the API.",
		levelsTitle: "Three explanation levels",
		headlineLabel: "Headline",
		paragraphLabel: "One paragraph",
		stepsLabel: "Step by step",
		whenToUseLabel: "When to use",
		rememberLabel: "Remember it as",
		openDemo: "Demo",
		openStorybook: "Storybook",
		openNpm: "npm",
		openGithub: "GitHub",
		language: "Language",
		notFound: "Package not found",
		notFoundText: "Choose a package in the side navigation to continue.",
		retrievalTitle: "Quick memory check",
		retrievalPrompt:
			"Before moving on, answer without looking: does this package store data, draw something, or coordinate tools?",
		readmeLabel: "Package README",
		readmeLoading: "Preparing Markdown and syntax highlighting...",
		coreConceptsTitle: "Core concepts",
		coreConceptsText:
			"Each route below teaches one central piece of this package. Open one at a time and try to explain the piece before reading the code.",
		conceptRoutes: "Concept routes",
		whyItMattersLabel: "Why it matters",
		sourceLabel: "Source",
		nextQuestionLabel: "Ask the agent",
		backToPackage: "Back to package",
	},
} as const;

export const packageDocs = [
	{
		id: "musical-domain",
		name: "@achorde/musical-domain",
		scope: "contracts",
		npm: "https://www.npmjs.com/package/@achorde/musical-domain",
		demo: "https://achorde-musical-domain.vercel.app/",
		github: "https://github.com/saitodisse/achorde/tree/main/packages/musical-domain",
		summary: {
			"pt-BR": {
				label: "Contratos musicais",
				headline: "O dicionário comum do ACHORDE.",
				paragraph:
					"Este pacote define os tipos e helpers que os outros pacotes usam para falar a mesma língua: símbolo de acorde, linha de cifra, diagnóstico de parser e posição no braço do instrumento.",
				steps: [
					"Receba uma ideia musical, como um acorde ou uma linha de cifra.",
					"Transforme essa ideia em uma estrutura TypeScript previsível.",
					"Passe essa estrutura para renderizadores, editores ou armazenamento sem depender de React.",
					"Use helpers pequenos para normalizar acordes, escolher voicings e ajustar pestanas.",
				],
				whenToUse:
					"Use quando você precisa de contratos estáveis para parser, editor, renderer ou banco de dados.",
				remember: "Ele não desenha a música; ele define o vocabulário da música.",
			},
			en: {
				label: "Musical contracts",
				headline: "The shared dictionary of ACHORDE.",
				paragraph:
					"This package defines the types and helpers other packages use to speak the same language: chord symbol, chord-sheet line, parser diagnostic, and fretted-instrument position.",
				steps: [
					"Receive a musical idea, such as a chord or a chord-sheet line.",
					"Turn that idea into a predictable TypeScript structure.",
					"Pass that structure to renderers, editors, or storage without depending on React.",
					"Use small helpers to normalize chords, choose voicings, and adjust barres.",
				],
				whenToUse:
					"Use it when you need stable contracts for a parser, editor, renderer, or database.",
				remember: "It does not draw the music; it defines the music vocabulary.",
			},
		},
	},
	{
		id: "source-catalog",
		name: "@achorde/source-catalog",
		scope: "contracts",
		npm: "https://www.npmjs.com/package/@achorde/source-catalog",
		github: "https://github.com/saitodisse/achorde/tree/main/packages/source-catalog",
		summary: {
			"pt-BR": {
				label: "Catálogos estáticos",
				headline: "O contrato para importar repertórios públicos.",
				paragraph:
					"Este pacote valida manifestos e envelopes de catálogos somente leitura. Ele ajuda um portal de artista a publicar músicas, artistas e versões de forma segura para um app consumidor puxar.",
				steps: [
					"Publique um manifesto com a lista de arquivos disponíveis.",
					"Coloque cada registro dentro de um envelope com origem, tipo e versão de schema.",
					"Valide que o catálogo é público, somente leitura e sem campos sensíveis.",
					"Deixe o app consumidor baixar os arquivos e reconstruir o catálogo localmente.",
				],
				whenToUse:
					"Use quando um site estático precisa servir dados para outro app importar.",
				remember: "Ele é o recibo de entrega do catálogo: diz o que existe e se está seguro.",
			},
			en: {
				label: "Static catalogs",
				headline: "The contract for importing public repertoires.",
				paragraph:
					"This package validates read-only catalog manifests and envelopes. It lets an artist portal publish songs, artists, and versions safely for a consuming app to pull.",
				steps: [
					"Publish a manifest listing the available files.",
					"Wrap each record in an envelope with source, type, and schema version.",
					"Validate that the catalog is public, read-only, and free of sensitive fields.",
					"Let the consuming app download the files and rebuild the catalog locally.",
				],
				whenToUse:
					"Use it when a static site needs to serve data for another app to import.",
				remember: "It is the catalog delivery receipt: what exists and whether it is safe.",
			},
		},
	},
	{
		id: "tab-renderer",
		name: "@achorde/tab-renderer",
		scope: "rendering",
		npm: "https://www.npmjs.com/package/@achorde/tab-renderer",
		demo: "https://tab-renderer-react.vercel.app/",
		storybook: "https://storybook-tab-renderer.vercel.app/",
		github: "https://github.com/saitodisse/achorde/tree/main/packages/tab-renderer",
		summary: {
			"pt-BR": {
				label: "Parser e cifra renderizada",
				headline: "O pacote que transforma texto de cifra em leitura visual.",
				paragraph:
					"Ele lê uma cifra textual, identifica acordes e letras, transpõe quando necessário e renderiza a música em React com acordes alinhados sobre a letra.",
				steps: [
					"Comece com o texto cru da música.",
					"Faça o parse para separar seções, linhas, acordes, espaços e letras.",
					"Transponha o resultado quando o tom precisa mudar.",
					"Renderize com o componente React ou use o core headless para montar sua própria UI.",
				],
				whenToUse:
					"Use quando você quer mostrar uma cifra legível, pesquisável ou transposta.",
				remember: "Ele é o leitor de partituras de texto: entende a cifra e coloca na tela.",
			},
			en: {
				label: "Parser and rendered tabs",
				headline: "The package that turns chord-sheet text into visual reading.",
				paragraph:
					"It reads raw chord-sheet text, identifies chords and lyrics, transposes when needed, and renders the song in React with chords aligned above the lyrics.",
				steps: [
					"Start with the raw song text.",
					"Parse it into sections, lines, chords, spaces, and lyrics.",
					"Transpose the result when the key needs to change.",
					"Render with the React component or use the headless core to build your own UI.",
				],
				whenToUse:
					"Use it when you want to display a readable, searchable, or transposed chord sheet.",
				remember: "It is the text score reader: it understands the chart and puts it on screen.",
			},
		},
	},
	{
		id: "svguitar-react",
		name: "@achorde/svguitar-react",
		scope: "rendering",
		npm: "https://www.npmjs.com/package/@achorde/svguitar-react",
		demo: "https://svguitar-react.vercel.app/",
		storybook: "https://storybook-svguitar-react.vercel.app/?path=/docs/components-chorddiagram--docs",
		github: "https://github.com/saitodisse/achorde/tree/main/packages/svguitar-react",
		summary: {
			"pt-BR": {
				label: "Diagramas de acorde",
				headline: "O desenho SVG de acordes no braço do violão.",
				paragraph:
					"Este pacote pega um voicing vindo do domínio musical e desenha um diagrama SVG configurável, com orientação, cores, tamanhos e suporte a pestanas.",
				steps: [
					"Receba um voicing com cordas, casas, dedos e pestanas.",
					"Escolha orientação, quantidade de casas e aparência.",
					"Calcule a posição visual de cada corda e dedo.",
					"Renderize um SVG responsivo para a aplicação ou material didático.",
				],
				whenToUse:
					"Use quando a pessoa precisa ver como montar um acorde no instrumento.",
				remember: "Ele desenha o mapa do acorde; não decide sozinho qual acorde tocar.",
			},
			en: {
				label: "Chord diagrams",
				headline: "The SVG drawing of guitar chords on the fretboard.",
				paragraph:
					"This package takes a voicing from the musical domain and draws a configurable SVG diagram with orientation, colors, sizes, and barre support.",
				steps: [
					"Receive a voicing with strings, frets, fingers, and barres.",
					"Choose orientation, fret count, and appearance.",
					"Compute the visual position of each string and finger.",
					"Render a responsive SVG for the app or teaching material.",
				],
				whenToUse:
					"Use it when someone needs to see how to hold a chord on the instrument.",
				remember: "It draws the chord map; it does not decide by itself which chord to play.",
			},
		},
	},
	{
		id: "interactive-fretboard",
		name: "@achorde/interactive-fretboard",
		scope: "editor",
		npm: "https://www.npmjs.com/package/@achorde/interactive-fretboard",
		demo: "https://interactive-fretboard.vercel.app/",
		storybook: "https://storybook-interactive-fretboard.vercel.app/",
		github: "https://github.com/saitodisse/achorde/tree/main/packages/interactive-fretboard",
		summary: {
			"pt-BR": {
				label: "Editor de braço",
				headline: "O pacote para editar posições tocando no braço do instrumento.",
				paragraph:
					"Ele transforma ponteiro, toque ou clique em mudanças de voicing. Em vez de só mostrar o acorde, permite montar, ajustar dedos e detectar mudanças em tempo real.",
				steps: [
					"Mostre o braço do instrumento como uma área interativa.",
					"Converta clique, toque ou caneta em uma corda e uma casa.",
					"Atualize o voicing controlado pela aplicação.",
					"Opcionalmente detecte o acorde resultante e devolva detalhes do gesto.",
				],
				whenToUse:
					"Use quando o usuário precisa criar ou corrigir posições manualmente.",
				remember: "Ele é a mesa de edição do acorde: a pessoa mexe e o voicing muda.",
			},
			en: {
				label: "Fretboard editor",
				headline: "The package for editing positions directly on the instrument neck.",
				paragraph:
					"It turns pointer, touch, or click input into voicing changes. Instead of only showing a chord, it lets users build, adjust fingers, and detect changes in real time.",
				steps: [
					"Show the instrument neck as an interactive area.",
					"Convert click, touch, or pen input into a string and fret.",
					"Update the voicing controlled by the application.",
					"Optionally detect the resulting chord and return gesture details.",
				],
				whenToUse:
					"Use it when the user needs to create or correct positions manually.",
				remember: "It is the chord editing desk: the person changes it and the voicing updates.",
			},
		},
	},
	{
		id: "storybook-config",
		name: "@achorde/storybook-config",
		scope: "infrastructure",
		github: "https://github.com/saitodisse/achorde/tree/main/packages/storybook-config",
		summary: {
			"pt-BR": {
				label: "Infraestrutura de Storybook",
				headline: "A configuração compartilhada para documentar componentes.",
				paragraph:
					"Este pacote evita repetir configuração de Storybook em cada biblioteca. Ele centraliza Vite, decorators e observabilidade para manter as demos consistentes.",
				steps: [
					"Cada pacote com UI mantém suas próprias stories.",
					"A configuração compartilhada entra no `.storybook/main.ts` do pacote.",
					"Os decorators e logs ajudam a diagnosticar erro de renderização.",
					"Cada Storybook fica livre para focar exemplos, não setup.",
				],
				whenToUse:
					"Use ao criar ou manter Storybooks dentro do monorepo ACHORDE.",
				remember: "Ele não é produto final; é a bancada que mantém os exemplos funcionando.",
			},
			en: {
				label: "Storybook infrastructure",
				headline: "The shared configuration for documenting components.",
				paragraph:
					"This package avoids repeating Storybook setup in each library. It centralizes Vite, decorators, and observability so demos stay consistent.",
				steps: [
					"Each UI package keeps its own stories.",
					"The shared configuration is imported in that package's `.storybook/main.ts`.",
					"Decorators and logs help diagnose rendering errors.",
					"Each Storybook can focus on examples instead of setup.",
				],
				whenToUse:
					"Use it when creating or maintaining Storybooks inside the ACHORDE monorepo.",
				remember: "It is not the final product; it is the bench that keeps examples working.",
			},
		},
	},
] as const satisfies PackageDoc[];

export const musicalDomainConceptDocs = [
	{
		id: "contract-boundary",
		source: "README.md, docs/architecture.md, src/versions.ts",
		copy: {
			"pt-BR": {
				label: "Limite do pacote",
				title: "O pacote define contratos, não produto.",
				summary:
					"@achorde/musical-domain é o vocabulário compartilhado entre parser, renderer, editor e app. Ele evita que cada pacote invente seu próprio formato para a mesma ideia musical.",
				whyItMatters:
					"Quando o limite fica claro, o pacote continua portátil: sem React, sem storage, sem rota e sem regra privada de aplicação.",
				steps: [
					"Use o pacote para nomes, tipos e helpers musicais reutilizáveis.",
					"Deixe parsing completo, SVG, UI, banco e sync fora dele.",
					"Trate a versão de contrato como sinal de mudança pública.",
				],
				code:
					'import { ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION } from "@achorde/musical-domain";\n\nconsole.log(ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION);',
				memoryPrompt:
					"Sem olhar: cite duas coisas que este pacote não deve fazer.",
				nextQuestion:
					"Peça para o agente comparar o limite deste pacote com tab-renderer, svguitar-react ou AC15.",
			},
			en: {
				label: "Package boundary",
				title: "The package defines contracts, not product behavior.",
				summary:
					"@achorde/musical-domain is the shared vocabulary between parser, renderer, editor, and app. It keeps each package from inventing a separate shape for the same musical idea.",
				whyItMatters:
					"When the boundary is clear, the package stays portable: no React, storage, routing, or private application rules.",
				steps: [
					"Use the package for reusable musical names, types, and helpers.",
					"Keep full parsing, SVG, UI, persistence, and sync outside it.",
					"Treat the contract version as a public-change signal.",
				],
				code:
					'import { ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION } from "@achorde/musical-domain";\n\nconsole.log(ACHORDE_MUSICAL_DOMAIN_CONTRACT_VERSION);',
				memoryPrompt:
					"Without looking: name two things this package should not do.",
				nextQuestion:
					"Ask the agent to compare this package boundary with tab-renderer, svguitar-react, or AC15.",
			},
		},
	},
	{
		id: "diagnostics",
		source: "src/diagnostics.ts, docs/migration.md",
		copy: {
			"pt-BR": {
				label: "Diagnósticos",
				title: "ParseDiagnostic é o erro traduzível do parser.",
				summary:
					"Um diagnóstico descreve o que deu errado, onde aconteceu e qual severidade o consumidor deve mostrar.",
				whyItMatters:
					"O parser pode falhar sem quebrar a UI: ele entrega dados estruturados para o app localizar, traduzir e destacar o problema.",
				steps: [
					"Escolha um code estável para o caso de erro.",
					"Inclua message, severity e posição quando existir.",
					"Use severity error para autoria inválida nas regras novas.",
				],
				code:
					'const diagnostic = {\n  code: "invalid-line",\n  message: "Line is not valid chord-chart content.",\n  severity: "error",\n  line: 3,\n  sourceRange: { startColumn: 0, endColumn: 27 },\n};',
				memoryPrompt:
					"Sem olhar: por que code é melhor que depender só de message?",
				nextQuestion:
					"Peça para o agente transformar um erro real de cifra em ParseDiagnostic.",
			},
			en: {
				label: "Diagnostics",
				title: "ParseDiagnostic is the parser's translatable error.",
				summary:
					"A diagnostic describes what went wrong, where it happened, and which severity the consumer should show.",
				whyItMatters:
					"The parser can fail without breaking the UI: it returns structured data so the app can localize, translate, and highlight the issue.",
				steps: [
					"Choose a stable code for the error case.",
					"Include message, severity, and position when available.",
					"Use severity error for invalid authoring under the new rules.",
				],
				code:
					'const diagnostic = {\n  code: "invalid-line",\n  message: "Line is not valid chord-chart content.",\n  severity: "error",\n  line: 3,\n  sourceRange: { startColumn: 0, endColumn: 27 },\n};',
				memoryPrompt:
					"Without looking: why is code better than relying only on message?",
				nextQuestion:
					"Ask the agent to turn a real chord-sheet error into ParseDiagnostic.",
			},
		},
	},
	{
		id: "chord-symbols",
		source: "src/chord-symbol.ts, src/chord-label.ts, src/chord-spelling.ts",
		copy: {
			"pt-BR": {
				label: "Símbolos de acorde",
				title: "ParsedChordSymbol separa repetição de acorde tocável.",
				summary:
					"O símbolo pode ser um acorde com root, suffix e bass, ou um marcador de repetição. Helpers normalizam rótulos e extraem metadados de spelling.",
				whyItMatters:
					"Renderizadores, busca e diagramas precisam saber se o texto representa um acorde real ou só uma repetição.",
				steps: [
					"Normalize o rótulo antes de comparar ou procurar.",
					"Leia root, suffix e bass quando o kind for chord.",
					"Não coloque marcadores de repetição em chordsFound.",
				],
				code:
					'normalizeChordSymbolLabel("C♯maj7"); // "C#maj7"\n\nconst chord = {\n  kind: "chord",\n  text: "Am/G",\n  root: "A",\n  suffix: "m",\n  bass: "G",\n};',
				memoryPrompt:
					"Sem olhar: qual campo diferencia acorde real de repetição?",
				nextQuestion:
					"Peça para o agente explicar a diferença entre suffix musical e quality de voicing.",
			},
			en: {
				label: "Chord symbols",
				title: "ParsedChordSymbol separates repeats from playable chords.",
				summary:
					"A symbol can be a chord with root, suffix, and bass, or a repeat marker. Helpers normalize labels and extract spelling metadata.",
				whyItMatters:
					"Renderers, search, and diagrams must know whether text is a real chord or only a repeat marker.",
				steps: [
					"Normalize the label before comparing or looking it up.",
					"Read root, suffix, and bass when kind is chord.",
					"Do not include repeat markers in chordsFound.",
				],
				code:
					'normalizeChordSymbolLabel("C♯maj7"); // "C#maj7"\n\nconst chord = {\n  kind: "chord",\n  text: "Am/G",\n  root: "A",\n  suffix: "m",\n  bass: "G",\n};',
				memoryPrompt:
					"Without looking: which field separates a real chord from a repeat?",
				nextQuestion:
					"Ask the agent to explain the difference between musical suffix and voicing quality.",
			},
		},
	},
	{
		id: "parsed-tabs",
		source: "src/tab-ast.ts, docs/migration.md",
		copy: {
			"pt-BR": {
				label: "ParsedTab",
				title: "ParsedTab é a AST canônica de uma cifra textual.",
				summary:
					"Uma cifra vira seções, linhas e tokens. Cada linha tem exatamente um tipo estrito: section-header, chords, lyrics ou blank.",
				whyItMatters:
					"O renderer pode alinhar acordes, preservar espaços e mostrar diagnósticos sem reprocessar o texto cru.",
				steps: [
					"Separe o texto em seções.",
					"Classifique cada linha com um dos quatro tipos.",
					"Preserve tokens de acorde, letra, decoração e espaço.",
					"Liste só acordes diagramáveis em chordsFound.",
				],
				code:
					'const tab = {\n  body: "[Verse]\\nC    G7\\nA lyric line",\n  sections: [{ id: "s1", order: 0, title: "Verse", originalTitle: "Verse", lines: [] }],\n  diagnostics: [],\n  parserVersion: "1.0.0",\n  astVersion: "1.0.0",\n  chordsFound: ["C", "G7"],\n};',
				memoryPrompt:
					"Sem olhar: quais são os quatro tipos de linha de ParsedTab?",
				nextQuestion:
					"Peça para o agente classificar três linhas reais de cifra como ParsedTabLine.",
			},
			en: {
				label: "ParsedTab",
				title: "ParsedTab is the canonical AST for a text chord sheet.",
				summary:
					"A chord sheet becomes sections, lines, and tokens. Each line has exactly one strict kind: section-header, chords, lyrics, or blank.",
				whyItMatters:
					"The renderer can align chords, preserve spaces, and show diagnostics without parsing raw text again.",
				steps: [
					"Split the text into sections.",
					"Classify each line with one of the four kinds.",
					"Preserve chord, lyric, decoration, and space tokens.",
					"List only diagrammable chords in chordsFound.",
				],
				code:
					'const tab = {\n  body: "[Verse]\\nC    G7\\nA lyric line",\n  sections: [{ id: "s1", order: 0, title: "Verse", originalTitle: "Verse", lines: [] }],\n  diagnostics: [],\n  parserVersion: "1.0.0",\n  astVersion: "1.0.0",\n  chordsFound: ["C", "G7"],\n};',
				memoryPrompt:
					"Without looking: what are the four ParsedTab line kinds?",
				nextQuestion:
					"Ask the agent to classify three real chord-sheet lines as ParsedTabLine.",
			},
		},
	},
	{
		id: "legacy-chart",
		source: "src/chord-chart-ast.ts, docs/migration.md",
		copy: {
			"pt-BR": {
				label: "Modelo legado",
				title: "ChordChartAst existe para compatibilidade.",
				summary:
					"O modelo antigo usa segmentos dentro de linhas. Ele continua exportado, mas a documentação aponta novos consumidores para ParsedTab.",
				whyItMatters:
					"Integrações antigas não quebram de uma vez, e código novo evita carregar decisões antigas para frente.",
				steps: [
					"Leia dados antigos com ChordChartAst quando necessário.",
					"Mapeie label para title, raw para text e segments para tokens.",
					"Use ParsedTab como destino em novas integrações.",
				],
				code:
					'// Legacy -> canonical\nChordChartSection.label -> ParsedTabSection.title\nChordChartLine.raw -> ParsedTabLine.text\nChordChartLine.segments -> ParsedTabLine.tokens',
				memoryPrompt:
					"Sem olhar: qual modelo deve ser usado por código novo?",
				nextQuestion:
					"Peça para o agente desenhar uma migração pequena de ChordChartAst para ParsedTab.",
			},
			en: {
				label: "Legacy model",
				title: "ChordChartAst exists for compatibility.",
				summary:
					"The old model uses segments inside lines. It remains exported, but the docs point new consumers to ParsedTab.",
				whyItMatters:
					"Old integrations do not break all at once, and new code avoids carrying old decisions forward.",
				steps: [
					"Read old data with ChordChartAst when necessary.",
					"Map label to title, raw to text, and segments to tokens.",
					"Use ParsedTab as the target for new integrations.",
				],
				code:
					'// Legacy -> canonical\nChordChartSection.label -> ParsedTabSection.title\nChordChartLine.raw -> ParsedTabLine.text\nChordChartLine.segments -> ParsedTabLine.tokens',
				memoryPrompt:
					"Without looking: which model should new code use?",
				nextQuestion:
					"Ask the agent to sketch a small ChordChartAst to ParsedTab migration.",
			},
		},
	},
	{
		id: "fretted-voicings",
		source: "src/fretted-voicing.ts, docs/architecture.md",
		copy: {
			"pt-BR": {
				label: "Voicings",
				title: "FrettedInstrumentVoicing descreve como tocar um acorde.",
				summary:
					"O voicing guarda instrumento, afinação, símbolo do acorde, cordas, casas, dedos, pestanas, origem e qualidade.",
				whyItMatters:
					"Esse contrato atravessa editor, SVG e app sem depender de uma UI específica.",
				steps: [
					"Use stringIndex baixo-para-alto: 1 é Mi grave, 6 é Mi agudo.",
					"Marque cada corda como muted, open ou fretted.",
					"Use barres com a mesma ordem de cordas.",
				],
				code:
					'const string = {\n  stringIndex: 1,\n  openNote: "E2",\n  fret: 3,\n  state: "fretted",\n  finger: 2,\n};',
				memoryPrompt:
					"Sem olhar: em guitarra padrão, stringIndex 1 é qual corda?",
				nextQuestion:
					"Peça para o agente revisar um voicing e verificar se a ordem das cordas está correta.",
			},
			en: {
				label: "Voicings",
				title: "FrettedInstrumentVoicing describes how to play a chord.",
				summary:
					"The voicing stores instrument, tuning, chord symbol, strings, frets, fingers, barres, source, and quality.",
				whyItMatters:
					"This contract crosses editor, SVG, and app code without depending on a specific UI.",
				steps: [
					"Use low-to-high stringIndex: 1 is low E, 6 is high E.",
					"Mark each string as muted, open, or fretted.",
					"Use barres with the same string order.",
				],
				code:
					'const string = {\n  stringIndex: 1,\n  openNote: "E2",\n  fret: 3,\n  state: "fretted",\n  finger: 2,\n};',
				memoryPrompt:
					"Without looking: on standard guitar, which string is stringIndex 1?",
				nextQuestion:
					"Ask the agent to review a voicing and check whether string order is correct.",
			},
		},
	},
	{
		id: "voicing-helpers",
		source: "src/fret-notation-parse.ts, src/fretted-barre-inference.ts, src/voicing-editor-pipeline.ts",
		copy: {
			"pt-BR": {
				label: "Helpers de voicing",
				title: "Helpers transformam entrada curta em voicing consistente.",
				summary:
					"O pacote parseia notação de casas, formata de volta, escolhe voicings, infere pestanas e normaliza a base visual.",
				whyItMatters:
					"Editor e app podem salvar dados coerentes antes de qualquer renderizador tentar desenhar o acorde.",
				steps: [
					"Parseie fretNotation como x32010 em ordem baixo-para-alto.",
					"Rode o pipeline para recalcular pestanas e baseFret.",
					"Use seleção de voicing para escolher a melhor opção disponível.",
				],
				code:
					'const voicing = parseFretNotationToVoicing({\n  fretNotation: "x32010",\n  chordSymbol: "C",\n  id: "c-major",\n});\n\nconst ready = applyVoicingEditorPipeline(voicing);',
				memoryPrompt:
					"Sem olhar: por que o pipeline deve rodar antes de salvar?",
				nextQuestion:
					"Peça para o agente converter uma fretNotation em FrettedInstrumentVoicing passo a passo.",
			},
			en: {
				label: "Voicing helpers",
				title: "Helpers turn compact input into a consistent voicing.",
				summary:
					"The package parses fret notation, formats it back, selects voicings, infers barres, and normalizes the display base.",
				whyItMatters:
					"Editor and app code can save coherent data before any renderer tries to draw the chord.",
				steps: [
					"Parse fretNotation such as x32010 in low-to-high order.",
					"Run the pipeline to recompute barres and baseFret.",
					"Use voicing selection to choose the best available option.",
				],
				code:
					'const voicing = parseFretNotationToVoicing({\n  fretNotation: "x32010",\n  chordSymbol: "C",\n  id: "c-major",\n});\n\nconst ready = applyVoicingEditorPipeline(voicing);',
				memoryPrompt:
					"Without looking: why should the pipeline run before saving?",
				nextQuestion:
					"Ask the agent to convert fretNotation into FrettedInstrumentVoicing step by step.",
			},
		},
	},
	{
		id: "theory-adapter",
		source: "src/theory-adapter.ts, docs/architecture.md",
		copy: {
			"pt-BR": {
				label: "Adapter musical",
				title: "MusicTheoryAdapter é uma porta para motores externos.",
				summary:
					"O pacote define a interface para transpor notas, parsear símbolos, obter notas e detectar acordes, mas não embute um motor de teoria musical.",
				whyItMatters:
					"Consumidores escolhem a biblioteca musical que quiserem sem forçar dependências pesadas no contrato público.",
				steps: [
					"Implemente a interface no pacote consumidor.",
					"Converta o resultado externo para ParsedChordSymbol.",
					"Mantenha a dependência do motor fora de musical-domain.",
				],
				code:
					'const adapter = {\n  transposePitchClass: (note, semitones) => transpose(note, semitones),\n  parseChordSymbol: (symbol) => parseChord(symbol),\n  getChordNotes: (symbol) => notesFor(symbol),\n  detectChord: (notes) => detect(notes),\n};',
				memoryPrompt:
					"Sem olhar: por que o pacote define a porta, mas não traz o motor?",
				nextQuestion:
					"Peça para o agente adaptar uma biblioteca de teoria musical para MusicTheoryAdapter.",
			},
			en: {
				label: "Theory adapter",
				title: "MusicTheoryAdapter is a port for external engines.",
				summary:
					"The package defines the interface for transposing notes, parsing symbols, getting notes, and detecting chords, but it does not bundle a music-theory engine.",
				whyItMatters:
					"Consumers choose whichever music library they want without forcing heavy dependencies into the public contract.",
				steps: [
					"Implement the interface in the consuming package.",
					"Convert the external result to ParsedChordSymbol.",
					"Keep the engine dependency outside musical-domain.",
				],
				code:
					'const adapter = {\n  transposePitchClass: (note, semitones) => transpose(note, semitones),\n  parseChordSymbol: (symbol) => parseChord(symbol),\n  getChordNotes: (symbol) => notesFor(symbol),\n  detectChord: (notes) => detect(notes),\n};',
				memoryPrompt:
					"Without looking: why does the package define the port but not bring the engine?",
				nextQuestion:
					"Ask the agent to adapt a music-theory library to MusicTheoryAdapter.",
			},
		},
	},
] as const satisfies readonly PackageSpecificConceptDoc[];

export function findMusicalDomainConceptDoc(
	conceptId: string | undefined,
) {
	return musicalDomainConceptDocs.find((conceptDoc) => conceptDoc.id === conceptId);
}

export function localeFromRoute(value: string | undefined): Locale {
	return value === "en" ? "en" : "pt-BR";
}

export function routeLocale(locale: Locale): RouteLocale {
	return locales[locale].route;
}

export function oppositeLocale(locale: Locale): Locale {
	return locale === "pt-BR" ? "en" : "pt-BR";
}

export function findPackageDoc(packageId: string | undefined) {
	return packageDocs.find((packageDoc) => packageDoc.id === packageId);
}
