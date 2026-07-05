export type Locale = "pt-BR" | "en";
export type RouteLocale = "pt-br" | "en";

export type PackageId =
	| "musical-domain"
	| "source-catalog"
	| "tab-renderer"
	| "svguitar-react"
	| "interactive-fretboard";

export type AppId = "ac15" | "artist-portal-base";

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

export type AppDoc = {
	id: AppId;
	name: string;
	scope: "product" | "portal";
	demo?: string;
	github: string;
	sources: string[];
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

export type AppConceptDoc = PackageSpecificConceptDoc & {
	appId: AppId;
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
		allApps: "Apps principais",
		startHere: "Comece aqui",
		startHereText:
			"Leia primeiro o pacote de contratos. Depois siga para parser/renderização, desenho de diagramas, edição interativa e infraestrutura.",
		packageRoutes: "Rotas por pacote",
		packageRoutesText:
			"Cada rota tem uma explicação fácil e cumulativa. A ideia é você conseguir lembrar o papel de cada pacote antes de olhar a API.",
		appRoutes: "Rotas por app",
		appRoutesText:
			"Os apps mostram onde os pacotes viram produto: AC15 consome, persiste e sincroniza; Artist Portal Base publica catálogos estáticos para importação.",
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
		notFoundText: "Escolha uma área na navegação lateral para continuar.",
		retrievalTitle: "Teste rápido de memória",
		retrievalPrompt:
			"Antes de seguir, tente responder sem olhar: esta área guarda dados, desenha algo ou coordena ferramentas?",
		readmeLabel: "README do pacote",
		sourceDocumentsLabel: "Documentos-fonte",
		readmeLoading: "Preparando Markdown e syntax highlighting...",
		coreConceptsTitle: "Conceitos centrais",
		coreConceptsText:
			"Cada rota abaixo ensina uma peça central desta área. Abra uma por vez e tente explicar a peça antes de olhar o código.",
		conceptRoutes: "Rotas por conceito",
		whyItMattersLabel: "Por que importa",
		sourceLabel: "Fonte",
		nextQuestionLabel: "Pergunte ao agente",
		backToPackage: "Voltar ao pacote",
		backToApp: "Voltar ao app",
	},
	en: {
		title: "ACHORDE Docs",
		kicker: "General documentation",
		headline: "Understand ACHORDE package by package, one step at a time.",
		intro:
			"ACHORDE is a set of packages for representing, rendering, and editing chord-based music. Each page teaches one part at three levels: headline, one paragraph, and step by step.",
		allPackages: "All packages",
		allApps: "Main apps",
		startHere: "Start here",
		startHereText:
			"Read the contracts package first. Then move through parsing/rendering, diagram drawing, interactive editing, and infrastructure.",
		packageRoutes: "Package routes",
		packageRoutesText:
			"Each route gives a simple cumulative explanation. The goal is to remember each package role before reading the API.",
		appRoutes: "App routes",
		appRoutesText:
			"The apps show where the packages become product: AC15 consumes, persists, and syncs; Artist Portal Base publishes static catalogs for import.",
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
		notFound: "Area not found",
		notFoundText: "Choose an area in the side navigation to continue.",
		retrievalTitle: "Quick memory check",
		retrievalPrompt:
			"Before moving on, answer without looking: does this area store data, draw something, or coordinate tools?",
		readmeLabel: "Package README",
		sourceDocumentsLabel: "Source documents",
		readmeLoading: "Preparing Markdown and syntax highlighting...",
		coreConceptsTitle: "Core concepts",
		coreConceptsText:
			"Each route below teaches one central piece of this area. Open one at a time and try to explain the piece before reading the code.",
		conceptRoutes: "Concept routes",
		whyItMattersLabel: "Why it matters",
		sourceLabel: "Source",
		nextQuestionLabel: "Ask the agent",
		backToPackage: "Back to package",
		backToApp: "Back to app",
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
] as const satisfies PackageDoc[];

export const appDocs = [
	{
		id: "ac15",
		name: "AC15",
		scope: "product",
		demo: "http://127.0.0.1:5285/",
		github: "https://github.com/saitodisse/ac15",
		sources: [
			"../ac15/README.md",
			"../ac15/AGENTS.md",
			"../ac15/docs/rfc/0001-offline-first-agent-friendly-chord-platform.md",
			"../ac15/docs/prd/0020-artist-portal-base-e-importacao-portal-aware.md",
		],
		summary: {
			"pt-BR": {
				label: "App consumidor offline-first",
				headline: "O produto que junta catálogo, cifra, acordes, storage e sync.",
				paragraph:
					"AC15 é o app privado que consome os pacotes públicos @achorde/* e transforma contratos musicais em uma experiência local-first: importar repertórios, ler cifras, resolver diagramas, salvar preferências e sincronizar comandos depois.",
				steps: [
					"Importe ou hidrate catálogos para o IndexedDB local.",
					"Abra uma versão tocável e carregue cifra, AST, preferências e voicings.",
					"Use os pacotes públicos para parser, renderização e edição sem duplicar contratos.",
					"Guarde mudanças locais em repositórios e outbox antes de depender da rede.",
				],
				whenToUse:
					"Use AC15 para validar o comportamento integrado do ecossistema em produto real.",
				remember:
					"Ele é o app consumidor: coordena produto e estado local, mas não deve virar dono dos contratos públicos.",
			},
			en: {
				label: "Offline-first consuming app",
				headline: "The product that joins catalog, chart, chords, storage, and sync.",
				paragraph:
					"AC15 is the private app that consumes the public @achorde/* packages and turns musical contracts into a local-first experience: importing repertoires, reading chord charts, resolving diagrams, saving preferences, and syncing commands later.",
				steps: [
					"Import or hydrate catalogs into local IndexedDB.",
					"Open a playable version and load chart text, AST, preferences, and voicings.",
					"Use public packages for parsing, rendering, and editing without duplicating contracts.",
					"Store local changes in repositories and outbox before relying on the network.",
				],
				whenToUse:
					"Use AC15 to validate the integrated ecosystem behavior in a real product.",
				remember:
					"It is the consuming app: it coordinates product and local state, but should not own public contracts.",
			},
		},
	},
	{
		id: "artist-portal-base",
		name: "Artist Portal Base",
		scope: "portal",
		demo: "http://127.0.0.1:5287/",
		github: "https://github.com/saitodisse/artist-portal-base",
		sources: [
			"../artist-portal-base/README.md",
			"../artist-portal-base/portal.config.ts",
			"../artist-portal-base/scripts/catalog-core.ts",
			"../artist-portal-base/src/components/PortalCatalogReader.tsx",
		],
		summary: {
			"pt-BR": {
				label: "Portal público importável",
				headline: "A base estática para artistas publicarem repertórios.",
				paragraph:
					"Artist Portal Base é um repo Astro + React que vira portal humano e catálogo importável ao mesmo tempo. O conteúdo fica em Markdown/YAML, o build gera manifest, checksums e NDJSON em /source-catalog/, e o AC15 importa tudo como fonte somente leitura.",
				steps: [
					"Clone a base e transforme o repo em um portal com origin próprio e upstream na base.",
					"Edite portal.config.ts, catalog/artist.md e as cifras em catalog/charts/.",
					"Rode validação para checar frontmatter, chaves sensíveis e parse das cifras.",
					"Gere o catálogo estático para publicar site, manifest e entidades importáveis.",
				],
				whenToUse:
					"Use quando um artista, banda ou comunidade precisa publicar um repertório público sem backend.",
				remember:
					"Ele é a origem editorial: bonito para humanos, determinístico para o AC15 importar.",
			},
			en: {
				label: "Importable public portal",
				headline: "The static base for artists to publish repertoires.",
				paragraph:
					"Artist Portal Base is an Astro + React repo that becomes both a human portal and an importable catalog. Content lives in Markdown/YAML, the build emits manifest, checksums, and NDJSON under /source-catalog/, and AC15 imports everything as a read-only source.",
				steps: [
					"Clone the base and turn the repo into a portal with its own origin and upstream pointing to the base.",
					"Edit portal.config.ts, catalog/artist.md, and charts under catalog/charts/.",
					"Run validation to check frontmatter, sensitive keys, and chord-chart parsing.",
					"Generate the static catalog to publish the site, manifest, and importable entities.",
				],
				whenToUse:
					"Use it when an artist, band, or community needs to publish a public repertoire without a backend.",
				remember:
					"It is the editorial source: readable for humans, deterministic for AC15 imports.",
			},
		},
	},
] as const satisfies AppDoc[];

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

export const packageConceptDocs: readonly PackageConceptDoc[] = [
	...musicalDomainConceptDocs.map((conceptDoc) => ({
		...conceptDoc,
		packageId: "musical-domain" as const,
	})),
	{
		packageId: "source-catalog",
		id: "pull-only-manifest",
		source: "packages/source-catalog/README.md, docs/contract.md, src/index.ts",
		copy: {
			"pt-BR": {
				label: "Manifesto pull-only",
				title: "SourceCatalogManifest publica o que pode ser importado.",
				summary:
					"O manifesto descreve o catálogo estático: id, nome, versão, arquivos, schema e capacidades. Ele só é válido quando declara acesso público de leitura.",
				whyItMatters:
					"Um app offline-first pode confiar no manifesto sem acoplar importação a servidor, sessão, rota privada ou push remoto.",
				steps: [
					"Declare mode como readonly.",
					"Liste arquivos JSON ou NDJSON com entityType e checksum quando existir.",
					"Faça capabilities.pull ser true e todas as capacidades de escrita serem false.",
					"Mantenha auth como none e conflictResolution como manual.",
				],
				code:
					'assertSourceCatalogManifest({\n  id: "demo-portal",\n  name: "Demo Portal",\n  version: "2026-07-04T00:00:00.000Z",\n  schemaVersion: "1.0.0",\n  mode: "readonly",\n  generatedAt: createIsoDateTime("2026-07-04T00:00:00.000Z"),\n  files: [{ url: "entities/artists.ndjson", entityType: "artist", mediaType: "application/x-ndjson" }],\n  capabilities: { pull: true, push: false, batchPush: false, realtime: false, proposals: false, revisions: false, moderation: false, conflictResolution: "manual", auth: "none" },\n});',
				memoryPrompt:
					"Sem olhar: quais duas capacidades deixam um manifesto inválido?",
				nextQuestion:
					"Peça para o agente revisar um source-manifest.json antes de publicar um portal.",
			},
			en: {
				label: "Pull-only manifest",
				title: "SourceCatalogManifest publishes what can be imported.",
				summary:
					"The manifest describes the static catalog: id, name, version, files, schema, and capabilities. It is valid only when it declares public read access.",
				whyItMatters:
					"An offline-first app can trust the manifest without coupling import to a server, session, private route, or remote push.",
				steps: [
					"Declare mode as readonly.",
					"List JSON or NDJSON files with entityType and checksum when present.",
					"Set capabilities.pull to true and all write capabilities to false.",
					"Keep auth as none and conflictResolution as manual.",
				],
				code:
					'assertSourceCatalogManifest({\n  id: "demo-portal",\n  name: "Demo Portal",\n  version: "2026-07-04T00:00:00.000Z",\n  schemaVersion: "1.0.0",\n  mode: "readonly",\n  generatedAt: createIsoDateTime("2026-07-04T00:00:00.000Z"),\n  files: [{ url: "entities/artists.ndjson", entityType: "artist", mediaType: "application/x-ndjson" }],\n  capabilities: { pull: true, push: false, batchPush: false, realtime: false, proposals: false, revisions: false, moderation: false, conflictResolution: "manual", auth: "none" },\n});',
				memoryPrompt:
					"Without looking: which two capabilities make a manifest invalid?",
				nextQuestion:
					"Ask the agent to review a source-manifest.json before publishing a portal.",
			},
		},
	},
	{
		packageId: "source-catalog",
		id: "entity-envelopes",
		source: "packages/source-catalog/README.md, src/index.ts",
		copy: {
			"pt-BR": {
				label: "Envelopes de entidade",
				title: "SourceCatalogEnvelope separa proveniência de payload.",
				summary:
					"Cada registro importável carrega sourceId, sourceRecordId, entityType e schemaVersion fora do payload real.",
				whyItMatters:
					"O consumidor sabe de onde o dado veio e como versionar a leitura sem exigir que cada tipo de entidade repita metadados.",
				steps: [
					"Escolha um entityType suportado, como artist, chordChart ou voicing.",
					"Use sourceId para ligar o registro ao manifesto.",
					"Use sourceRecordId como identidade estável dentro da fonte.",
					"Coloque o conteúdo de domínio em payload.",
				],
				code:
					'assertSourceCatalogEnvelope({\n  sourceId: "demo-portal",\n  sourceRecordId: "chart:1",\n  entityType: "chordChart",\n  schemaVersion: "1.0.0",\n  payload: { rawText: "C\\nLyrics" },\n});',
				memoryPrompt:
					"Sem olhar: qual campo identifica o registro dentro da fonte?",
				nextQuestion:
					"Peça para o agente modelar envelopes para artistas, obras e cifras.",
			},
			en: {
				label: "Entity envelopes",
				title: "SourceCatalogEnvelope separates provenance from payload.",
				summary:
					"Each importable record carries sourceId, sourceRecordId, entityType, and schemaVersion outside the real payload.",
				whyItMatters:
					"The consumer knows where the data came from and how to version the read without forcing every entity type to repeat metadata.",
				steps: [
					"Choose a supported entityType such as artist, chordChart, or voicing.",
					"Use sourceId to connect the record to the manifest.",
					"Use sourceRecordId as the stable identity inside the source.",
					"Put the domain content in payload.",
				],
				code:
					'assertSourceCatalogEnvelope({\n  sourceId: "demo-portal",\n  sourceRecordId: "chart:1",\n  entityType: "chordChart",\n  schemaVersion: "1.0.0",\n  payload: { rawText: "C\\nLyrics" },\n});',
				memoryPrompt:
					"Without looking: which field identifies the record inside the source?",
				nextQuestion:
					"Ask the agent to model envelopes for artists, works, and chord charts.",
			},
		},
	},
	{
		packageId: "source-catalog",
		id: "sensitive-key-guard",
		source: "packages/source-catalog/README.md, src/index.ts, src/index.test.ts",
		copy: {
			"pt-BR": {
				label: "Guarda de privacidade",
				title: "Campos sensíveis são rejeitados em qualquer profundidade.",
				summary:
					"O validador percorre manifestos e envelopes recusando chaves de conta, sessão e identidade pessoal como email, access_token e owner_name.",
				whyItMatters:
					"Catálogos são artefatos públicos. A validação protege o portal de publicar credenciais ou dados pessoais por acidente.",
				steps: [
					"Valide manifesto e envelopes antes de escrever arquivos públicos.",
					"Não permita tokens, sessões, emails ou ids de provedor.",
					"Trate falha de validação como bloqueio de publicação.",
				],
				code:
					'assertNoForbiddenSourceCatalogKeys({\n  payload: {\n    nested: [{ owner_name: "Do Not Publish" }],\n  },\n});\n// throws: Forbidden source catalog key: owner_name',
				memoryPrompt:
					"Sem olhar: por que a verificação precisa ser recursiva?",
				nextQuestion:
					"Peça para o agente criar um checklist de publicação segura de catálogo.",
			},
			en: {
				label: "Privacy guard",
				title: "Sensitive fields are rejected at any depth.",
				summary:
					"The validator walks manifests and envelopes and rejects account, session, and personal-identity keys such as email, access_token, and owner_name.",
				whyItMatters:
					"Catalogs are public artifacts. Validation protects the portal from publishing credentials or personal data by accident.",
				steps: [
					"Validate the manifest and envelopes before writing public files.",
					"Do not allow tokens, sessions, emails, or provider ids.",
					"Treat validation failure as a publication blocker.",
				],
				code:
					'assertNoForbiddenSourceCatalogKeys({\n  payload: {\n    nested: [{ owner_name: "Do Not Publish" }],\n  },\n});\n// throws: Forbidden source catalog key: owner_name',
				memoryPrompt:
					"Without looking: why does the check need to be recursive?",
				nextQuestion:
					"Ask the agent to create a safe catalog publication checklist.",
			},
		},
	},
	{
		packageId: "source-catalog",
		id: "deterministic-checksums",
		source: "packages/source-catalog/README.md, src/index.ts, src/index.test.ts",
		copy: {
			"pt-BR": {
				label: "Checksums",
				title: "Checksums tornam arquivos estáticos verificáveis.",
				summary:
					"O pacote cria hashes SHA-256 e monta um mapa determinístico por URL para que consumidores confirmem integridade de arquivos publicados.",
				whyItMatters:
					"Importação estática precisa de confiança barata: o app pode detectar arquivo trocado, truncado ou servido errado.",
				steps: [
					"Normalize o hash para hexadecimal de 64 caracteres.",
					"Calcule SHA-256 do conteúdo quando estiver no browser ou runtime com Web Crypto.",
					"Ordene arquivos por URL ao criar o mapa checksums.",
				],
				code:
					'const sha256 = await createChecksumFromText("artist portal\\n");\n\nconst checksums = createSourceCatalogChecksums([\n  { url: "artists.ndjson", sha256 },\n]);',
				memoryPrompt:
					"Sem olhar: por que o mapa de checksums deve ser determinístico?",
				nextQuestion:
					"Peça para o agente verificar checksums de um catálogo local.",
			},
			en: {
				label: "Checksums",
				title: "Checksums make static files verifiable.",
				summary:
					"The package creates SHA-256 hashes and builds a deterministic URL map so consumers can confirm published file integrity.",
				whyItMatters:
					"Static import needs cheap trust: the app can detect a swapped, truncated, or wrongly served file.",
				steps: [
					"Normalize the hash to a 64-character hexadecimal string.",
					"Calculate SHA-256 from content when Web Crypto is available.",
					"Sort files by URL when creating the checksums map.",
				],
				code:
					'const sha256 = await createChecksumFromText("artist portal\\n");\n\nconst checksums = createSourceCatalogChecksums([\n  { url: "artists.ndjson", sha256 },\n]);',
				memoryPrompt:
					"Without looking: why should the checksums map be deterministic?",
				nextQuestion:
					"Ask the agent to verify checksums for a local catalog.",
			},
		},
	},
	{
		packageId: "source-catalog",
		id: "static-file-shape",
		source: "packages/source-catalog/docs/contract.md, README.md",
		copy: {
			"pt-BR": {
				label: "Forma dos arquivos",
				title: "O catálogo vive como arquivos públicos versionados.",
				summary:
					"A publicação esperada fica em /source-catalog/: source-manifest.json, checksums.json e arquivos de entidades em JSON ou NDJSON.",
				whyItMatters:
					"Esse formato funciona em hospedagem estática simples e deixa o consumidor importar sem API customizada.",
				steps: [
					"Publique source-manifest.json como ponto de entrada.",
					"Coloque checksums.json ao lado para integridade.",
					"Separe entidades em arquivos por tipo ou lote.",
					"Mantenha URLs relativas e estáveis.",
				],
				code:
					'/source-catalog/source-manifest.json\n/source-catalog/checksums.json\n/source-catalog/entities/artists.ndjson\n/source-catalog/entities/chord-charts.ndjson',
				memoryPrompt:
					"Sem olhar: qual arquivo é o ponto de entrada do catálogo?",
				nextQuestion:
					"Peça para o agente desenhar a árvore /source-catalog/ de um portal.",
			},
			en: {
				label: "File shape",
				title: "The catalog lives as versioned public files.",
				summary:
					"The expected publication lives under /source-catalog/: source-manifest.json, checksums.json, and entity files in JSON or NDJSON.",
				whyItMatters:
					"This shape works on simple static hosting and lets the consumer import without a custom API.",
				steps: [
					"Publish source-manifest.json as the entry point.",
					"Place checksums.json beside it for integrity.",
					"Split entities into files by type or batch.",
					"Keep relative URLs stable.",
				],
				code:
					'/source-catalog/source-manifest.json\n/source-catalog/checksums.json\n/source-catalog/entities/artists.ndjson\n/source-catalog/entities/chord-charts.ndjson',
				memoryPrompt:
					"Without looking: which file is the catalog entry point?",
				nextQuestion:
					"Ask the agent to design the /source-catalog/ tree for a portal.",
			},
		},
	},
	{
		packageId: "tab-renderer",
		id: "entrypoints",
		source: "packages/tab-renderer/README.md, docs/rfc/0001-package-structure-and-public-api.md",
		copy: {
			"pt-BR": {
				label: "Entrypoints",
				title: "Core headless e React adapter têm responsabilidades separadas.",
				summary:
					"O pacote publica @achorde/tab-renderer para parse, transposição e preparo; @achorde/tab-renderer/react para componentes React.",
				whyItMatters:
					"Consumidores sem React podem usar o core, enquanto apps React recebem um viewer pronto sem misturar UI no parser.",
				steps: [
					"Use o entrypoint principal para transformar texto em estruturas.",
					"Use /react quando precisar do componente Tab ou primitivas.",
					"Mantenha CSS e composição visual fora do core.",
				],
				code:
					'import { parseTab } from "@achorde/tab-renderer";\nimport { Tab } from "@achorde/tab-renderer/react";',
				memoryPrompt:
					"Sem olhar: qual entrypoint você usaria em um worker sem React?",
				nextQuestion:
					"Peça para o agente escolher o entrypoint certo para uma integração sua.",
			},
			en: {
				label: "Entrypoints",
				title: "Headless core and React adapter have separate responsibilities.",
				summary:
					"The package publishes @achorde/tab-renderer for parsing, transposition, and preparation; @achorde/tab-renderer/react for React components.",
				whyItMatters:
					"Non-React consumers can use the core, while React apps get a ready viewer without mixing UI into the parser.",
				steps: [
					"Use the main entrypoint to transform text into structures.",
					"Use /react when you need the Tab component or primitives.",
					"Keep CSS and visual composition out of the core.",
				],
				code:
					'import { parseTab } from "@achorde/tab-renderer";\nimport { Tab } from "@achorde/tab-renderer/react";',
				memoryPrompt:
					"Without looking: which entrypoint would you use in a worker without React?",
				nextQuestion:
					"Ask the agent to choose the right entrypoint for one of your integrations.",
			},
		},
	},
	{
		packageId: "tab-renderer",
		id: "strict-parser",
		source: "packages/tab-renderer/README.md, docs/README.md, src/core/parseTab.ts",
		copy: {
			"pt-BR": {
				label: "Parser estrito",
				title: "parseTab transforma texto cru em ParsedTab.",
				summary:
					"O parser separa seções, linhas, tokens, espaços e diagnósticos usando a AST compartilhada de musical-domain.",
				whyItMatters:
					"Renderização, busca e erros ficam baseados em colunas reais, não em heurísticas repetidas no app.",
				steps: [
					"Passe o corpo textual para parseTab.",
					"Leia sections, lines e tokens na AST retornada.",
					"Mostre diagnostics quando o texto violar a gramática.",
				],
				code:
					'const parsed = parseTab("[Verse]\\nC    G\\nLyrics");\n\nconsole.log(parsed.sections[0]?.lines);\nconsole.log(parsed.diagnostics);',
				memoryPrompt:
					"Sem olhar: por que preservar espaços é importante para cifras?",
				nextQuestion:
					"Peça para o agente classificar uma cifra real usando parseTab.",
			},
			en: {
				label: "Strict parser",
				title: "parseTab turns raw text into ParsedTab.",
				summary:
					"The parser separates sections, lines, tokens, spaces, and diagnostics using the shared musical-domain AST.",
				whyItMatters:
					"Rendering, search, and errors are based on real columns instead of app-side repeated heuristics.",
				steps: [
					"Pass the text body to parseTab.",
					"Read sections, lines, and tokens from the returned AST.",
					"Show diagnostics when the text violates the grammar.",
				],
				code:
					'const parsed = parseTab("[Verse]\\nC    G\\nLyrics");\n\nconsole.log(parsed.sections[0]?.lines);\nconsole.log(parsed.diagnostics);',
				memoryPrompt:
					"Without looking: why is preserving spaces important for chord sheets?",
				nextQuestion:
					"Ask the agent to classify a real chord sheet using parseTab.",
			},
		},
	},
	{
		packageId: "tab-renderer",
		id: "chord-detection",
		source: "packages/tab-renderer/README.md, docs/plans/2026-06-03-chord-symbols-and-diagrammable-boundaries.md, src/core/collectDiagrammableChords.ts",
		copy: {
			"pt-BR": {
				label: "Detecção de acordes",
				title: "chordsFound vem do parser, não da letra crua.",
				summary:
					"O fluxo parseChordSymbol -> tokenizeContentWord -> tokenizeRawLine -> collectDiagrammableChords decide quais símbolos são acordes reais.",
				whyItMatters:
					"Apps consumidores podem mostrar diagramas faltantes sem redescobrir acordes e sem confundir decoração, letra ou repetição.",
				steps: [
					"Parseie cada token candidato com parseChordSymbol.",
					"Guarde ChordToken apenas para símbolos tocáveis.",
					"Use ParsedTab.chordsFound como contrato downstream.",
				],
				code:
					'const parsed = parseTab("C    G7\\nA lyric line");\n\nconsole.log(parsed.chordsFound); // ["C", "G7"]',
				memoryPrompt:
					"Sem olhar: por que downstream não deve varrer a letra de novo?",
				nextQuestion:
					"Peça para o agente explicar por que um texto específico não entrou em chordsFound.",
			},
			en: {
				label: "Chord detection",
				title: "chordsFound comes from the parser, not raw lyrics.",
				summary:
					"The parseChordSymbol -> tokenizeContentWord -> tokenizeRawLine -> collectDiagrammableChords flow decides which symbols are real chords.",
				whyItMatters:
					"Consumer apps can show missing diagrams without rediscovering chords and without confusing decoration, lyrics, or repeats.",
				steps: [
					"Parse each candidate token with parseChordSymbol.",
					"Store ChordToken only for playable symbols.",
					"Use ParsedTab.chordsFound as the downstream contract.",
				],
				code:
					'const parsed = parseTab("C    G7\\nA lyric line");\n\nconsole.log(parsed.chordsFound); // ["C", "G7"]',
				memoryPrompt:
					"Without looking: why should downstream not scan lyrics again?",
				nextQuestion:
					"Ask the agent to explain why a specific text did not enter chordsFound.",
			},
		},
	},
	{
		packageId: "tab-renderer",
		id: "transposition",
		source: "packages/tab-renderer/README.md, src/core/transposeParsedTab.ts, src/core/transposeChordSymbol.ts",
		copy: {
			"pt-BR": {
				label: "Transposição",
				title: "transposeParsedTab muda acordes mantendo a estrutura.",
				summary:
					"A transposição aplica semitons aos símbolos de acorde e recalcula a lista diagramável sem perder seções, letras ou colunas.",
				whyItMatters:
					"O app consegue mudar tom para leitura ou performance sem alterar o texto original salvo.",
				steps: [
					"Parseie primeiro para obter uma AST confiável.",
					"Aplique transposeParsedTab com o número de semitons.",
					"Renderize ou prepare a AST transposta.",
				],
				code:
					'const parsed = parseTab(body);\nconst transposed = transposeParsedTab(parsed, 2);\n\nconsole.log(transposed.chordsFound);',
				memoryPrompt:
					"Sem olhar: a transposição deve acontecer antes ou depois de preparar barras?",
				nextQuestion:
					"Peça para o agente transpor uma progressão e conferir chordsFound.",
			},
			en: {
				label: "Transposition",
				title: "transposeParsedTab changes chords while keeping structure.",
				summary:
					"Transposition applies semitones to chord symbols and recomputes the diagrammable list without losing sections, lyrics, or columns.",
				whyItMatters:
					"The app can change key for reading or performance without changing the saved original text.",
				steps: [
					"Parse first to get a reliable AST.",
					"Apply transposeParsedTab with the semitone count.",
					"Render or prepare the transposed AST.",
				],
				code:
					'const parsed = parseTab(body);\nconst transposed = transposeParsedTab(parsed, 2);\n\nconsole.log(transposed.chordsFound);',
				memoryPrompt:
					"Without looking: should transposition happen before or after preparing bars?",
				nextQuestion:
					"Ask the agent to transpose a progression and check chordsFound.",
			},
		},
	},
	{
		packageId: "tab-renderer",
		id: "prepared-song",
		source: "packages/tab-renderer/README.md, docs/rfc/0002-interleaved-bars-and-tab-style-config.md, src/core/prepareSongFromParsedTab.ts",
		copy: {
			"pt-BR": {
				label: "PreparedSong",
				title: "prepareSongFromParsedTab cria o stream visual da cifra.",
				summary:
					"O ParsedTab vira seções preparadas e barList intercalando letras, acordes, decoração e separadores para o viewer.",
				whyItMatters:
					"Esse passo concentra o truque de acorde-sobre-letra e evita que componentes React façam parse de novo.",
				steps: [
					"Receba ParsedTab já parseado e opcionalmente transposto.",
					"Alinhe linhas de acorde com linhas de letra.",
					"Gere BarSegment para letras, acordes e separadores.",
				],
				code:
					'const prepared = prepareSongFromParsedTab(parsed, {\n  viewMode: "e",\n});\n\nconsole.log(prepared.sections[0]?.barList);',
				memoryPrompt:
					"Sem olhar: que objeto contém barList?",
				nextQuestion:
					"Peça para o agente comparar prepareSongFromParsedTab com prepareSong legado.",
			},
			en: {
				label: "PreparedSong",
				title: "prepareSongFromParsedTab creates the visual stream.",
				summary:
					"ParsedTab becomes prepared sections and a barList interleaving lyrics, chords, decoration, and separators for the viewer.",
				whyItMatters:
					"This step concentrates the chord-over-lyric trick and keeps React components from parsing again.",
				steps: [
					"Receive an already parsed and optionally transposed ParsedTab.",
					"Align chord lines with lyric lines.",
					"Generate BarSegment entries for lyrics, chords, and separators.",
				],
				code:
					'const prepared = prepareSongFromParsedTab(parsed, {\n  viewMode: "e",\n});\n\nconsole.log(prepared.sections[0]?.barList);',
				memoryPrompt:
					"Without looking: which object contains barList?",
				nextQuestion:
					"Ask the agent to compare prepareSongFromParsedTab with legacy prepareSong.",
			},
		},
	},
	{
		packageId: "tab-renderer",
		id: "tab-style-config",
		source: "packages/tab-renderer/README.md, docs/rfc/0002-interleaved-bars-and-tab-style-config.md, src/react/styled/defaultTabStyle.ts",
		copy: {
			"pt-BR": {
				label: "TabStyleConfig",
				title: "TabStyleConfig controla leitura, não produto.",
				summary:
					"O viewer expõe tipografia, cores, viewMode, displayMode e offsets de acorde sem incluir fullscreen, scroll ou preferências de app.",
				whyItMatters:
					"O pacote continua reutilizável: apps podem adaptar leitura visual sem transformar o renderer em uma feature de produto.",
				steps: [
					"Use displayMode para mostrar acordes, letras ou ambos.",
					"Use viewMode o/e para espaçamento original ou estendido.",
					"Altere fontSize, lineHeight, chordHeight e cores no componente Tab.",
				],
				code:
					'<Tab\n  body={body}\n  style={{\n    displayMode: "both",\n    viewMode: "e",\n    transposeNumber: 0,\n    fontSize: 21,\n  }}\n/>',
				memoryPrompt:
					"Sem olhar: por que scrollSpeed não pertence a TabStyleConfig?",
				nextQuestion:
					"Peça para o agente montar uma configuração de leitura para palco.",
			},
			en: {
				label: "TabStyleConfig",
				title: "TabStyleConfig controls reading, not product behavior.",
				summary:
					"The viewer exposes typography, colors, viewMode, displayMode, and chord offsets without including fullscreen, scroll, or app preferences.",
				whyItMatters:
					"The package stays reusable: apps can adapt visual reading without turning the renderer into a product feature.",
				steps: [
					"Use displayMode to show chords, lyrics, or both.",
					"Use viewMode o/e for original or extended spacing.",
					"Adjust fontSize, lineHeight, chordHeight, and colors on the Tab component.",
				],
				code:
					'<Tab\n  body={body}\n  style={{\n    displayMode: "both",\n    viewMode: "e",\n    transposeNumber: 0,\n    fontSize: 21,\n  }}\n/>',
				memoryPrompt:
					"Without looking: why does scrollSpeed not belong in TabStyleConfig?",
				nextQuestion:
					"Ask the agent to build a stage-reading configuration.",
			},
		},
	},
	{
		packageId: "svguitar-react",
		id: "voicing-first-api",
		source: "packages/svguitar-react/README.md, specs/001-guitar-svg/data-model.md, docs/plans/2026-06-03-voicing-render-adapter-boundaries.md",
		copy: {
			"pt-BR": {
				label: "API voicing-first",
				title: "ChordDiagram prefere FrettedInstrumentVoicing.",
				summary:
					"O renderer recebe o contrato musical compartilhado e converte internamente para dedos, pestanas e primeira casa visual.",
				whyItMatters:
					"Editor, app e renderer usam a mesma ordem de cordas: stringIndex 1 é a corda mais grave, não uma escolha visual.",
				steps: [
					"Monte ou receba um FrettedInstrumentVoicing.",
					"Passe em voicing para ChordDiagram.",
					"Deixe a visualização mapear a ordem para SVG.",
				],
				code:
					'<ChordDiagram\n  voicing={cMajorVoicing}\n  view="vertical-right"\n/>',
				memoryPrompt:
					"Sem olhar: stringIndex 1 representa qual corda na guitarra padrão?",
				nextQuestion:
					"Peça para o agente revisar um voicing antes de renderizar.",
			},
			en: {
				label: "Voicing-first API",
				title: "ChordDiagram prefers FrettedInstrumentVoicing.",
				summary:
					"The renderer receives the shared musical contract and converts it internally to fingers, barres, and the visible first fret.",
				whyItMatters:
					"Editor, app, and renderer use the same string order: stringIndex 1 is the lowest-pitched string, not a visual choice.",
				steps: [
					"Build or receive a FrettedInstrumentVoicing.",
					"Pass it as voicing to ChordDiagram.",
					"Let the selected view map order to SVG.",
				],
				code:
					'<ChordDiagram\n  voicing={cMajorVoicing}\n  view="vertical-right"\n/>',
				memoryPrompt:
					"Without looking: which standard guitar string does stringIndex 1 represent?",
				nextQuestion:
					"Ask the agent to review a voicing before rendering.",
			},
		},
	},
	{
		packageId: "svguitar-react",
		id: "legacy-inputs",
		source: "packages/svguitar-react/README.md, specs/001-guitar-svg/data-model.md, src/components/ChordDiagram/types.ts",
		copy: {
			"pt-BR": {
				label: "Entradas legadas",
				title: "Chord e fretNotation ainda são formas de entrada.",
				summary:
					"Além de voicing, o componente aceita dedos/pestanas estruturados ou fretNotation como x32010 para compatibilidade e exemplos simples.",
				whyItMatters:
					"Consumidores antigos continuam funcionando, mas integrações novas podem migrar gradualmente para o contrato compartilhado.",
				steps: [
					"Use fingers e barres quando já tiver geometria de diagrama.",
					"Use fretNotation para exemplos compactos.",
					"Prefira voicing quando o dado cru vem do domínio musical.",
				],
				code:
					'<ChordDiagram\n  fretNotation="x32010"\n  tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}\n/>',
				memoryPrompt:
					"Sem olhar: qual entrada tem precedência como contrato público preferido?",
				nextQuestion:
					"Peça para o agente converter fretNotation para voicing.",
			},
			en: {
				label: "Legacy inputs",
				title: "Chord and fretNotation are still input shapes.",
				summary:
					"Besides voicing, the component accepts structured fingers/barres or fretNotation such as x32010 for compatibility and simple examples.",
				whyItMatters:
					"Older consumers keep working, while new integrations can gradually migrate to the shared contract.",
				steps: [
					"Use fingers and barres when you already have diagram geometry.",
					"Use fretNotation for compact examples.",
					"Prefer voicing when raw data comes from the musical domain.",
				],
				code:
					'<ChordDiagram\n  fretNotation="x32010"\n  tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}\n/>',
				memoryPrompt:
					"Without looking: which input has precedence as the preferred public contract?",
				nextQuestion:
					"Ask the agent to convert fretNotation to voicing.",
			},
		},
	},
	{
		packageId: "svguitar-react",
		id: "layout-engines",
		source: "packages/svguitar-react/README.md, src/components/ChordDiagram/layout.ts, src/components/ChordDiagram/types.ts",
		copy: {
			"pt-BR": {
				label: "Layout engines",
				title: "Views são estratégias de mapeamento para SVG.",
				summary:
					"horizontal-right, horizontal-left, vertical-right e vertical-left implementam LayoutEngine para transformar cordas e casas em coordenadas.",
				whyItMatters:
					"A orientação muda sem mudar o contrato musical. Labels continuam legíveis e uma estratégia customizada pode ser registrada.",
				steps: [
					"Escolha view para uma estratégia pronta.",
					"Passe layoutEngine quando precisar de mapeamento próprio.",
					"Use layoutRegistry para registrar engines adicionais.",
				],
				code:
					'layoutRegistry.register(customEngine);\n\n<ChordDiagram voicing={voicing} layoutEngine={customEngine} />',
				memoryPrompt:
					"Sem olhar: view muda o dado musical ou só o mapeamento visual?",
				nextQuestion:
					"Peça para o agente explicar a diferença entre vertical-right e horizontal-left.",
			},
			en: {
				label: "Layout engines",
				title: "Views are SVG mapping strategies.",
				summary:
					"horizontal-right, horizontal-left, vertical-right, and vertical-left implement LayoutEngine to turn strings and frets into coordinates.",
				whyItMatters:
					"Orientation changes without changing the musical contract. Labels stay readable and a custom strategy can be registered.",
				steps: [
					"Choose view for a built-in strategy.",
					"Pass layoutEngine when you need custom mapping.",
					"Use layoutRegistry to register additional engines.",
				],
				code:
					'layoutRegistry.register(customEngine);\n\n<ChordDiagram voicing={voicing} layoutEngine={customEngine} />',
				memoryPrompt:
					"Without looking: does view change musical data or only visual mapping?",
				nextQuestion:
					"Ask the agent to explain the difference between vertical-right and horizontal-left.",
			},
		},
	},
	{
		packageId: "svguitar-react",
		id: "auto-first-fret",
		source: "packages/svguitar-react/README.md, specs/001-guitar-svg/spec.md, src/components/ChordDiagram/utils/autoFirstFret.ts",
		copy: {
			"pt-BR": {
				label: "Auto first fret",
				title: "autoFirstFret enquadra acordes em posições altas.",
				summary:
					"Quando dedos ficam fora da faixa visível, o componente pode ajustar firstFret e ampliar fretCount até um limite.",
				whyItMatters:
					"Diagramas de regiões altas continuam legíveis sem exigir que o consumidor calcule a janela visual manualmente.",
				steps: [
					"Ative autoFirstFret explicitamente.",
					"Deixe firstFret manual ter precedência quando informado.",
					"Confirme se o range de dedos cabe no fretCount resultante.",
				],
				code:
					'<ChordDiagram\n  autoFirstFret\n  fretCount={4}\n  fingers={[{ string: 1, fret: 7, is_muted: false }]}\n/>',
				memoryPrompt:
					"Sem olhar: firstFret manual perde ou ganha de autoFirstFret?",
				nextQuestion:
					"Peça para o agente testar se um acorde alto cabe em quatro casas.",
			},
			en: {
				label: "Auto first fret",
				title: "autoFirstFret frames high-position chords.",
				summary:
					"When fingers are outside the visible range, the component can adjust firstFret and expand fretCount up to a limit.",
				whyItMatters:
					"High-position diagrams stay readable without forcing the consumer to calculate the visual window manually.",
				steps: [
					"Enable autoFirstFret explicitly.",
					"Let manual firstFret take precedence when provided.",
					"Confirm whether the finger range fits in the resulting fretCount.",
				],
				code:
					'<ChordDiagram\n  autoFirstFret\n  fretCount={4}\n  fingers={[{ string: 1, fret: 7, is_muted: false }]}\n/>',
				memoryPrompt:
					"Without looking: does manual firstFret lose or win against autoFirstFret?",
				nextQuestion:
					"Ask the agent to test whether a high-position chord fits in four frets.",
			},
		},
	},
	{
		packageId: "svguitar-react",
		id: "renderer-boundary",
		source: "packages/svguitar-react/docs/plans/2026-06-03-voicing-render-adapter-boundaries.md, specs/001-guitar-svg/spec.md",
		copy: {
			"pt-BR": {
				label: "Limite do renderer",
				title: "svguitar-react desenha; não resolve identidade musical.",
				summary:
					"O pacote não procura acordes, aliases, catálogos, rotas, persistência ou regras de produto. Ele transforma entrada de acorde em SVG.",
				whyItMatters:
					"Manter esse limite evita que uma biblioteca visual fique acoplada ao AC15 ou a bancos privados de acordes.",
				steps: [
					"Resolva qual voicing usar antes de chamar ChordDiagram.",
					"Deixe aliases e lookup para musical-domain ou app consumidor.",
					"Use o renderer apenas para layout, estilo e SVG.",
				],
				code:
					'const voicing = selectPreferredVoicing(chordEntry.voicings);\n\nreturn <ChordDiagram voicing={voicing} />;',
				memoryPrompt:
					"Sem olhar: qual pacote deve decidir qual voicing é preferido?",
				nextQuestion:
					"Peça para o agente separar responsabilidades entre app, musical-domain e svguitar-react.",
			},
			en: {
				label: "Renderer boundary",
				title: "svguitar-react draws; it does not resolve musical identity.",
				summary:
					"The package does not look up chords, aliases, catalogs, routes, persistence, or product rules. It turns chord input into SVG.",
				whyItMatters:
					"Keeping this boundary avoids coupling a visual library to AC15 or private chord databases.",
				steps: [
					"Resolve which voicing to use before calling ChordDiagram.",
					"Leave aliases and lookup to musical-domain or the consuming app.",
					"Use the renderer only for layout, styling, and SVG.",
				],
				code:
					'const voicing = selectPreferredVoicing(chordEntry.voicings);\n\nreturn <ChordDiagram voicing={voicing} />;',
				memoryPrompt:
					"Without looking: which package should decide which voicing is preferred?",
				nextQuestion:
					"Ask the agent to separate responsibilities between app, musical-domain, and svguitar-react.",
			},
		},
	},
	{
		packageId: "interactive-fretboard",
		id: "controlled-voicing",
		source: "packages/interactive-fretboard/README.md, src/components/InteractiveFretboard/types.ts",
		copy: {
			"pt-BR": {
				label: "Voicing controlado",
				title: "InteractiveFretboard edita um FrettedInstrumentVoicing controlado.",
				summary:
					"O componente recebe value e devolve mudanças por onChange. O app continua dono do estado, persistência e validação de produto.",
				whyItMatters:
					"Esse padrão permite desfazer, salvar, sincronizar ou comparar versões fora da biblioteca visual.",
				steps: [
					"Crie um voicing inicial no formato de musical-domain.",
					"Passe value para InteractiveFretboard.",
					"Atualize seu estado com details.voicing em onChange.",
				],
				code:
					'<InteractiveFretboard\n  value={voicing}\n  onChange={(details) => setVoicing(details.voicing)}\n/>',
				memoryPrompt:
					"Sem olhar: quem é dono do estado final, o componente ou o app?",
				nextQuestion:
					"Peça para o agente desenhar um fluxo salvar/desfazer usando details.voicing.",
			},
			en: {
				label: "Controlled voicing",
				title: "InteractiveFretboard edits a controlled FrettedInstrumentVoicing.",
				summary:
					"The component receives value and returns changes through onChange. The app still owns state, persistence, and product validation.",
				whyItMatters:
					"This pattern allows undo, save, sync, or version comparison outside the visual library.",
				steps: [
					"Create an initial voicing in the musical-domain shape.",
					"Pass value to InteractiveFretboard.",
					"Update your state with details.voicing in onChange.",
				],
				code:
					'<InteractiveFretboard\n  value={voicing}\n  onChange={(details) => setVoicing(details.voicing)}\n/>',
				memoryPrompt:
					"Without looking: who owns the final state, the component or the app?",
				nextQuestion:
					"Ask the agent to design a save/undo flow using details.voicing.",
			},
		},
	},
	{
		packageId: "interactive-fretboard",
		id: "viewbox-hit-testing",
		source: "packages/interactive-fretboard/README.md, specs/001-interactive-fretboard/research.md, src/interaction/screenToSvgPoint.ts, src/interaction/hitTestFretCell.ts",
		copy: {
			"pt-BR": {
				label: "Hit-test SVG",
				title: "O clique vira corda/casa via viewBox, não pixels frágeis.",
				summary:
					"O pacote converte clientX/clientY com getScreenCTM().inverse() e usa geometria do frame para achar a célula tocada.",
				whyItMatters:
					"Escala CSS, zoom e responsividade não quebram edição porque o cálculo usa coordenadas SVG estáveis.",
				steps: [
					"Converta o PointerEvent para ponto no SVG.",
					"Use hitTestFretCell contra o frame calculado.",
					"Renderize áreas invisíveis de hit para alvos confortáveis.",
				],
				code:
					'const point = screenToSvgPoint(svg, event);\nconst target = hitTestFretCell(frame, point);\n\nif (target) applyTapToEditorState(state, target);',
				memoryPrompt:
					"Sem olhar: por que getBoundingClientRect em linhas finas foi rejeitado?",
				nextQuestion:
					"Peça para o agente depurar um clique que cai na casa errada.",
			},
			en: {
				label: "SVG hit-testing",
				title: "A click becomes string/fret through viewBox, not fragile pixels.",
				summary:
					"The package converts clientX/clientY with getScreenCTM().inverse() and uses frame geometry to find the touched cell.",
				whyItMatters:
					"CSS scale, zoom, and responsiveness do not break editing because the calculation uses stable SVG coordinates.",
				steps: [
					"Convert the PointerEvent into an SVG point.",
					"Use hitTestFretCell against the computed frame.",
					"Render invisible hit areas for comfortable targets.",
				],
				code:
					'const point = screenToSvgPoint(svg, event);\nconst target = hitTestFretCell(frame, point);\n\nif (target) applyTapToEditorState(state, target);',
				memoryPrompt:
					"Without looking: why was getBoundingClientRect on thin lines rejected?",
				nextQuestion:
					"Ask the agent to debug a click that lands on the wrong fret.",
			},
		},
	},
	{
		packageId: "interactive-fretboard",
		id: "view-modes",
		source: "packages/interactive-fretboard/README.md, src/layout/viewMode.ts, src/layout/types.ts",
		copy: {
			"pt-BR": {
				label: "Modos de visualização",
				title: "Orientação e mão mudam o mapa visual, não o contrato.",
				summary:
					"horizontal/vertical e right/left resolvem para quatro modos. createVisualToStringIndex traduz posição visual para stringIndex canônico.",
				whyItMatters:
					"O usuário pode editar em orientações diferentes sem inverter a semântica de cordas salva no voicing.",
				steps: [
					"Escolha orientation horizontal ou vertical.",
					"Escolha handedness right ou left.",
					"Use o mapeamento visual para atualizar stringIndex correto.",
				],
				code:
					'const viewMode = resolveViewMode("vertical", "left");\nconst toStringIndex = createVisualToStringIndex(viewMode, 6);\n\nconsole.log(toStringIndex(0));',
				memoryPrompt:
					"Sem olhar: view mode deve alterar stringIndex salvo?",
				nextQuestion:
					"Peça para o agente explicar a inversão de cordas em left-handed.",
			},
			en: {
				label: "View modes",
				title: "Orientation and handedness change the visual map, not the contract.",
				summary:
					"horizontal/vertical and right/left resolve to four modes. createVisualToStringIndex translates visual position into canonical stringIndex.",
				whyItMatters:
					"The user can edit in different orientations without inverting the saved string semantics in the voicing.",
				steps: [
					"Choose horizontal or vertical orientation.",
					"Choose right or left handedness.",
					"Use the visual mapping to update the correct stringIndex.",
				],
				code:
					'const viewMode = resolveViewMode("vertical", "left");\nconst toStringIndex = createVisualToStringIndex(viewMode, 6);\n\nconsole.log(toStringIndex(0));',
				memoryPrompt:
					"Without looking: should view mode change saved stringIndex?",
				nextQuestion:
					"Ask the agent to explain string inversion in left-handed mode.",
			},
		},
	},
	{
		packageId: "interactive-fretboard",
		id: "finger-gestures",
		source: "packages/interactive-fretboard/README.md, src/adapters/applyFinger.ts, src/interaction/resolvePointerButton.ts",
		copy: {
			"pt-BR": {
				label: "Gestos de dedo",
				title: "Botões do ponteiro controlam toque, ciclo e dedo fixo.",
				summary:
					"primary alterna a célula, secondary cicla dedos 1-4 e middle aplica o dedo fixo, todos retornando pointerButton em details.",
				whyItMatters:
					"Editar digitação fica rápido em desktop sem quebrar toque/caneta, que continuam no caminho primary.",
				steps: [
					"Normalize o botão com resolvePointerButton.",
					"Use applyTap para alternar casa.",
					"Use applyFingerCycle ou applyFingerStick para digitação.",
				],
				code:
					'if (details.pointerButton === "secondary") {\n  console.log("finger cycled", details.voicing);\n}',
				memoryPrompt:
					"Sem olhar: qual botão cicla dedos 1 a 4?",
				nextQuestion:
					"Peça para o agente simular três cliques em uma célula fretted.",
			},
			en: {
				label: "Finger gestures",
				title: "Pointer buttons control tap, cycle, and sticky finger.",
				summary:
					"primary toggles the cell, secondary cycles fingers 1-4, and middle applies the sticky finger, all returning pointerButton in details.",
				whyItMatters:
					"Fingering edits become fast on desktop without breaking touch/pen, which stay on the primary path.",
				steps: [
					"Normalize the button with resolvePointerButton.",
					"Use applyTap to toggle the fret.",
					"Use applyFingerCycle or applyFingerStick for fingering.",
				],
				code:
					'if (details.pointerButton === "secondary") {\n  console.log("finger cycled", details.voicing);\n}',
				memoryPrompt:
					"Without looking: which button cycles fingers 1 through 4?",
				nextQuestion:
					"Ask the agent to simulate three clicks on a fretted cell.",
			},
		},
	},
	{
		packageId: "interactive-fretboard",
		id: "change-pipeline",
		source: "packages/interactive-fretboard/README.md, src/adapters/applyChangePipeline.ts",
		copy: {
			"pt-BR": {
				label: "Pipeline de mudança",
				title: "applyChangePipeline transforma gesto em voicing, notas e acorde detectado.",
				summary:
					"Depois do tap, o pipeline reconstrói o voicing, infere pestanas quando configurado, calcula notas pressionadas e opcionalmente detecta acorde.",
				whyItMatters:
					"A UI recebe um pacote de mudança completo em vez de juntar estado visual, teoria musical e formatação em lugares diferentes.",
				steps: [
					"Converta estado visual para FrettedInstrumentVoicing.",
					"Rode inferBarresFromFrettedVoicing quando inferBarresOnChange estiver ativo.",
					"Devolva fretNotation, pressedNotes e detectedChord conforme configuração.",
				],
				code:
					'<InteractiveFretboard\n  value={voicing}\n  inferBarresOnChange\n  detectChord\n  onChange={(details) => console.log(details.detectedChord)}\n/>',
				memoryPrompt:
					"Sem olhar: quais três dados além de voicing podem vir em onChange?",
				nextQuestion:
					"Peça para o agente explicar quando ativar inferBarresOnChange.",
			},
			en: {
				label: "Change pipeline",
				title: "applyChangePipeline turns gesture into voicing, notes, and detected chord.",
				summary:
					"After the tap, the pipeline rebuilds the voicing, infers barres when configured, calculates pressed notes, and optionally detects the chord.",
				whyItMatters:
					"The UI receives one complete change package instead of stitching visual state, music theory, and formatting in different places.",
				steps: [
					"Convert visual state to FrettedInstrumentVoicing.",
					"Run inferBarresFromFrettedVoicing when inferBarresOnChange is active.",
					"Return fretNotation, pressedNotes, and detectedChord based on configuration.",
				],
				code:
					'<InteractiveFretboard\n  value={voicing}\n  inferBarresOnChange\n  detectChord\n  onChange={(details) => console.log(details.detectedChord)}\n/>',
				memoryPrompt:
					"Without looking: which three fields besides voicing can arrive in onChange?",
				nextQuestion:
					"Ask the agent to explain when to enable inferBarresOnChange.",
			},
		},
	},
] as const;

export const appConceptDocs = [
	{
		appId: "ac15",
		id: "offline-first-state",
		source: "../ac15/README.md, docs/rfc/0001-offline-first-agent-friendly-chord-platform.md, docs/prd/0001-offline-first-foundation.md",
		copy: {
			"pt-BR": {
				label: "Estado offline-first",
				title: "AC15 trata IndexedDB como verdade local antes da rede.",
				summary:
					"O app foi desenhado para continuar útil sem conexão. Importação, parse, preferências, voicings e comandos pendentes vivem localmente antes de qualquer confirmação remota.",
				whyItMatters:
					"Se a UI depender da rede para tocar ou ler uma cifra, o produto quebra exatamente no ensaio, no palco ou no estudo offline.",
				steps: [
					"Carregue catálogos e versões tocáveis para storage local.",
					"Resolva leitura, transposição e diagramas usando dados locais.",
					"Persist a mudança local primeiro.",
					"Deixe sync remoto confirmar ou reprocessar depois.",
				],
				code:
					"// Regra mental do AC15\nconst ui = projectLocalState(indexedDbState);\nconst remoteAck = await syncLater(outboxCommand);",
				memoryPrompt:
					"Sem olhar: por que sucesso local e sucesso remoto são estados diferentes?",
				nextQuestion:
					"Peça para o agente mapear uma ação do viewer até o storage local.",
			},
			en: {
				label: "Offline-first state",
				title: "AC15 treats IndexedDB as local truth before the network.",
				summary:
					"The app is designed to remain useful without a connection. Importing, parsing, preferences, voicings, and pending commands live locally before any remote acknowledgement.",
				whyItMatters:
					"If the UI depends on the network to play or read a chart, the product fails during rehearsal, on stage, or in offline study.",
				steps: [
					"Load catalogs and playable versions into local storage.",
					"Resolve reading, transposition, and diagrams from local data.",
					"Persist the local change first.",
					"Let remote sync confirm or retry later.",
				],
				code:
					"// AC15 mental rule\nconst ui = projectLocalState(indexedDbState);\nconst remoteAck = await syncLater(outboxCommand);",
				memoryPrompt:
					"Without looking: why are local success and remote success different states?",
				nextQuestion:
					"Ask the agent to map one viewer action all the way to local storage.",
			},
		},
	},
	{
		appId: "ac15",
		id: "layer-boundaries",
		source: "../ac15/AGENTS.md, README.md, machine/package-boundaries.json",
		copy: {
			"pt-BR": {
				label: "Limites de camadas",
				title: "UI projeta estado; domínio e storage ficam fora do React.",
				summary:
					"O AC15 separa apps/web, domínio, storage, sync, contratos e UI. Cada camada tem uma responsabilidade para evitar que tela, banco e regra musical se misturem.",
				whyItMatters:
					"Essa fronteira mantém mudanças pequenas: uma rota pode mudar sem reescrever parser, e um repositório Dexie pode mudar sem quebrar o domínio.",
				steps: [
					"Use apps/web para rotas, composição e estado de interface.",
					"Use packages/domain para regras puras e invariantes.",
					"Use packages/storage para esconder Dexie atrás de repositórios.",
					"Use packages/ui para adapters visuais sobre pacotes públicos.",
				],
				code:
					"// Forma esperada\nconst model = await loadViewerModel(playableVersionId);\nreturn <ViewerRoute model={model} />;",
				memoryPrompt:
					"Sem olhar: qual camada pode importar Dexie?",
				nextQuestion:
					"Peça para o agente classificar uma mudança nova na camada correta.",
			},
			en: {
				label: "Layer boundaries",
				title: "UI projects state; domain and storage stay outside React.",
				summary:
					"AC15 separates apps/web, domain, storage, sync, contracts, and UI. Each layer has one responsibility so screens, database code, and musical rules do not blend together.",
				whyItMatters:
					"This boundary keeps changes small: a route can change without rewriting the parser, and a Dexie repository can change without breaking the domain.",
				steps: [
					"Use apps/web for routes, composition, and interface state.",
					"Use packages/domain for pure rules and invariants.",
					"Use packages/storage to hide Dexie behind repositories.",
					"Use packages/ui for visual adapters over public packages.",
				],
				code:
					"// Expected shape\nconst model = await loadViewerModel(playableVersionId);\nreturn <ViewerRoute model={model} />;",
				memoryPrompt:
					"Without looking: which layer may import Dexie?",
				nextQuestion:
					"Ask the agent to classify a new change into the right layer.",
			},
		},
	},
	{
		appId: "ac15",
		id: "viewer-pipeline",
		source: "../ac15/README.md, apps/web/src/features/viewer/load-viewer-model.ts, apps/web/src/features/viewer/viewer-route.tsx",
		copy: {
			"pt-BR": {
				label: "Pipeline do viewer",
				title: "A cifra vira modelo carregado antes de virar tela.",
				summary:
					"O viewer não renderiza texto cru diretamente. Ele carrega versão tocável, cifra, AST cacheada, preferências, key visual e voicings antes de projetar a leitura.",
				whyItMatters:
					"Quando o pipeline é explícito, fica claro onde corrigir uma falha: importação, cache de parse, preferência, seleção de voicing ou render.",
				steps: [
					"Receba playableVersionId pela rota.",
					"Carregue ChordChart e cache de AST no storage.",
					"Projete configurações do DialKit em estilo de cifra e preferências.",
					"Renderize a cifra e o painel de diagramas a partir do modelo.",
				],
				code:
					"const model = await loadViewerModel({ playableVersionId });\nconst style = viewerDialToTabStyle(dial);\nrenderChart(model.parsedTab, style);",
				memoryPrompt:
					"Sem olhar: o slider de tom altera o rawText persistido?",
				nextQuestion:
					"Peça para o agente explicar um bug de viewer em qual etapa do pipeline.",
			},
			en: {
				label: "Viewer pipeline",
				title: "The chart becomes a loaded model before becoming UI.",
				summary:
					"The viewer does not render raw text directly. It loads the playable version, chart, cached AST, preferences, visual key, and voicings before projecting the reading surface.",
				whyItMatters:
					"When the pipeline is explicit, it is clear where to fix a failure: import, parse cache, preference, voicing selection, or render.",
				steps: [
					"Receive playableVersionId from the route.",
					"Load ChordChart and AST cache from storage.",
					"Project DialKit settings into chart style and preferences.",
					"Render the chart and diagram panel from the model.",
				],
				code:
					"const model = await loadViewerModel({ playableVersionId });\nconst style = viewerDialToTabStyle(dial);\nrenderChart(model.parsedTab, style);",
				memoryPrompt:
					"Without looking: does the key slider mutate persisted rawText?",
				nextQuestion:
					"Ask the agent to place a viewer bug in one pipeline step.",
			},
		},
	},
	{
		appId: "ac15",
		id: "chord-identity-registry",
		source: "../ac15/README.md, apps/web/src/features/viewer/chord-diagram-registry.ts, docs/adr/0003-identidade-de-acorde-alias-e-voicing.md",
		copy: {
			"pt-BR": {
				label: "Registry de acordes",
				title: "Símbolos da cifra resolvem para identidade, alias e voicing.",
				summary:
					"O viewer pega chordsFound do parser e tenta resolver cada símbolo contra identidades canônicas, apelidos, equivalências convencionais e voicings locais ou importados.",
				whyItMatters:
					"Sem registry, cada grafia de acorde viraria um caso isolado e o app inventaria diagramas ou falharia em aliases comuns.",
				steps: [
					"Leia os símbolos encontrados na cifra renderizada.",
					"Procure match exato, alias manual e equivalência convencional.",
					"Escolha o voicing explícito ou preferido pelo usuário.",
					"Quando faltar dados, mostre fallback acionável em vez de adivinhar.",
				],
				code:
					"const entry = registry.resolve(\"Gb7M\");\nconst voicing = selectPreferredVoicing(entry, userAffinity);",
				memoryPrompt:
					"Sem olhar: por que alias e identidade não são a mesma coisa?",
				nextQuestion:
					"Peça para o agente rastrear um acorde ausente até o fallback correto.",
			},
			en: {
				label: "Chord registry",
				title: "Chart symbols resolve to identity, alias, and voicing.",
				summary:
					"The viewer takes chordsFound from the parser and resolves each symbol against canonical identities, aliases, conventional equivalences, and local or imported voicings.",
				whyItMatters:
					"Without the registry, every spelling would become its own case and the app would invent diagrams or miss common aliases.",
				steps: [
					"Read symbols found in the rendered chart.",
					"Look for exact match, manual alias, and conventional equivalence.",
					"Choose the explicit voicing or the user's preferred one.",
					"When data is missing, show an actionable fallback instead of guessing.",
				],
				code:
					"const entry = registry.resolve(\"Gb7M\");\nconst voicing = selectPreferredVoicing(entry, userAffinity);",
				memoryPrompt:
					"Without looking: why are alias and identity not the same thing?",
				nextQuestion:
					"Ask the agent to trace a missing chord to the right fallback.",
			},
		},
	},
	{
		appId: "ac15",
		id: "source-catalog-import",
		source: "../ac15/docs/prd/0020-artist-portal-base-e-importacao-portal-aware.md, apps/web/src/features/source-catalog/source-catalog-sync.ts, packages/sync-engine/src/source-catalog-importer.ts",
		copy: {
			"pt-BR": {
				label: "Importação de catálogo",
				title: "Portais entram como fontes pull-only com proveniência preservada.",
				summary:
					"O AC15 importa manifest, checksums e NDJSON de /source-catalog/. Registros externos viram dados locais com sourceId, sem sobrescrever verdade local silenciosamente.",
				whyItMatters:
					"Isso permite receber repertórios públicos sem acoplar o produto a um portal, servidor ou API privada.",
				steps: [
					"Baixe source-manifest.json a partir da URL configurada.",
					"Valide modo readonly, arquivos e checksums.",
					"Importe envelopes de artist, musicalWork, playableVersion e chordChart.",
					"Persist o sourceId sincronizado para status, reset e hidratação futuros.",
				],
				code:
					"await syncCatalogFromServer(\"https://artist.example/source-catalog/\");\nconst sourceId = localStorage.getItem(LAST_SOURCE_ID);",
				memoryPrompt:
					"Sem olhar: por que o AC15 salva sourceId depois do sync bem-sucedido?",
				nextQuestion:
					"Peça para o agente comparar uma importação de portal com o fallback ac12-export.",
			},
			en: {
				label: "Catalog import",
				title: "Portals enter as pull-only sources with provenance preserved.",
				summary:
					"AC15 imports manifest, checksums, and NDJSON from /source-catalog/. External records become local data with sourceId, without silently overwriting local truth.",
				whyItMatters:
					"This lets the product receive public repertoires without coupling itself to one portal, server, or private API.",
				steps: [
					"Download source-manifest.json from the configured URL.",
					"Validate readonly mode, files, and checksums.",
					"Import artist, musicalWork, playableVersion, and chordChart envelopes.",
					"Persist the synced sourceId for future status, reset, and hydration.",
				],
				code:
					"await syncCatalogFromServer(\"https://artist.example/source-catalog/\");\nconst sourceId = localStorage.getItem(LAST_SOURCE_ID);",
				memoryPrompt:
					"Without looking: why does AC15 store sourceId after successful sync?",
				nextQuestion:
					"Ask the agent to compare a portal import with the ac12-export fallback.",
			},
		},
	},
	{
		appId: "ac15",
		id: "outbox-sync",
		source: "../ac15/docs/prd/0006-sync-engine-mvp.md, packages/sync-engine/src/index.ts, packages/storage/src/repositories/outbox.dexie-repository.ts",
		copy: {
			"pt-BR": {
				label: "Outbox de sync",
				title: "Comandos locais aguardam confirmação remota explícita.",
				summary:
					"O sync engine persiste comandos pendentes, processa FIFO por agregado e separa synced, failed e blocked. A rede não decide se a edição local existe.",
				whyItMatters:
					"Essa regra é o coração offline-first: a pessoa pode continuar trabalhando, e falhas remotas ficam rastreáveis em vez de apagar a ação local.",
				steps: [
					"Crie um comando de outbox para uma mudança local.",
					"Liste comandos pending ou failed em ordem estável.",
					"Envie por adaptador canônico de servidor.",
					"Marque synced, failed ou blocked conforme o resultado explícito.",
				],
				code:
					"await outbox.save(command);\nawait runOutboxFifoByAggregate({ outbox, adapter });",
				memoryPrompt:
					"Sem olhar: por que um comando blocked pausa o agregado?",
				nextQuestion:
					"Peça para o agente desenhar a diferença entre retry e blocked.",
			},
			en: {
				label: "Sync outbox",
				title: "Local commands wait for explicit remote acknowledgement.",
				summary:
					"The sync engine persists pending commands, processes FIFO per aggregate, and separates synced, failed, and blocked. The network does not decide whether the local edit exists.",
				whyItMatters:
					"This rule is the offline-first core: the person can keep working, and remote failures stay traceable instead of erasing local action.",
				steps: [
					"Create an outbox command for a local change.",
					"List pending or failed commands in stable order.",
					"Send through a canonical server adapter.",
					"Mark synced, failed, or blocked from the explicit result.",
				],
				code:
					"await outbox.save(command);\nawait runOutboxFifoByAggregate({ outbox, adapter });",
				memoryPrompt:
					"Without looking: why does a blocked command pause its aggregate?",
				nextQuestion:
					"Ask the agent to draw the difference between retry and blocked.",
			},
		},
	},
	{
		appId: "artist-portal-base",
		id: "updateable-base",
		source: "../artist-portal-base/README.md, ../ac15/docs/adr/0007-portais-git-native-e-catalogos-validados.md",
		copy: {
			"pt-BR": {
				label: "Base atualizável",
				title: "Cada portal real tem origin próprio e upstream na base.",
				summary:
					"O portal não é uma instância editada dentro do AC15. Ele nasce como repo próprio, mantém histórico editorial próprio e pode receber melhorias da base com merge de upstream.",
				whyItMatters:
					"Isso dá colaboração, forks, revisão e continuidade usando Git, sem construir um CMS ou forge musical cedo demais.",
				steps: [
					"Clone artist-portal-base para um novo repositório.",
					"Renomeie a base como upstream.",
					"Configure origin para o portal real.",
					"Traga melhorias futuras com git fetch upstream e git merge upstream/main.",
				],
				code:
					"git remote rename origin upstream\ngit remote add origin https://github.com/org/portal.git\ngit merge upstream/main",
				memoryPrompt:
					"Sem olhar: por que o portal real não deve editar a base diretamente?",
				nextQuestion:
					"Peça para o agente montar o fluxo de criação de um portal novo.",
			},
			en: {
				label: "Updateable base",
				title: "Each real portal has its own origin and the base as upstream.",
				summary:
					"The portal is not an instance edited inside AC15. It starts as its own repo, keeps its own editorial history, and can receive base improvements by merging upstream.",
				whyItMatters:
					"This gives collaboration, forks, review, and continuity through Git without building a CMS or music forge too early.",
				steps: [
					"Clone artist-portal-base into a new repository.",
					"Rename the base remote to upstream.",
					"Configure origin for the real portal.",
					"Bring future improvements with git fetch upstream and git merge upstream/main.",
				],
				code:
					"git remote rename origin upstream\ngit remote add origin https://github.com/org/portal.git\ngit merge upstream/main",
				memoryPrompt:
					"Without looking: why should the real portal not edit the base directly?",
				nextQuestion:
					"Ask the agent to build the creation flow for a new portal.",
			},
		},
	},
	{
		appId: "artist-portal-base",
		id: "portal-identity",
		source: "../artist-portal-base/README.md, portal.config.ts, scripts/portal-init.ts",
		copy: {
			"pt-BR": {
				label: "Identidade do portal",
				title: "portal.config.ts define sourceId, URLs, tema e publicação.",
				summary:
					"A identidade pública do portal vive em um arquivo pequeno: nome, sourceId, URL, basePath, repositório, links, cores e versão de schema do catálogo.",
				whyItMatters:
					"O AC15 precisa de sourceId estável para proveniência, enquanto o site precisa de URL e basePath corretos para GitHub Pages ou domínio próprio.",
				steps: [
					"Escolha um sourceId estável e único.",
					"Configure publicName, siteUrl, basePath e repositoryUrl.",
					"Ajuste links e tokens visuais mínimos.",
					"Use portal:init para substituir identidade demo no início.",
				],
				code:
					"pnpm portal:init --source-id my-artist --name \"My Artist\" --site-url https://my-org.github.io",
				memoryPrompt:
					"Sem olhar: qual campo conecta portal importado e proveniência no AC15?",
				nextQuestion:
					"Peça para o agente revisar um portal.config.ts antes de publicar.",
			},
			en: {
				label: "Portal identity",
				title: "portal.config.ts defines sourceId, URLs, theme, and publication.",
				summary:
					"The portal's public identity lives in one small file: name, sourceId, URL, basePath, repository, links, colors, and catalog schema version.",
				whyItMatters:
					"AC15 needs a stable sourceId for provenance, while the site needs correct URL and basePath for GitHub Pages or a custom domain.",
				steps: [
					"Choose a stable and unique sourceId.",
					"Configure publicName, siteUrl, basePath, and repositoryUrl.",
					"Adjust links and minimal visual tokens.",
					"Use portal:init to replace demo identity at the start.",
				],
				code:
					"pnpm portal:init --source-id my-artist --name \"My Artist\" --site-url https://my-org.github.io",
				memoryPrompt:
					"Without looking: which field connects an imported portal to AC15 provenance?",
				nextQuestion:
					"Ask the agent to review a portal.config.ts before publishing.",
			},
		},
	},
	{
		appId: "artist-portal-base",
		id: "markdown-catalog",
		source: "../artist-portal-base/README.md, catalog/artist.md, catalog/charts/*/demo.md, scripts/catalog-core.ts",
		copy: {
			"pt-BR": {
				label: "Catálogo em Markdown",
				title: "Artista e cifras ficam em arquivos legíveis por humanos.",
				summary:
					"O conteúdo editorial fica em catalog/artist.md e catalog/charts/<musica>/<versao>.md. Frontmatter guarda metadados; o corpo guarda a cifra bruta.",
				whyItMatters:
					"Contribuidores podem revisar repertório em pull requests simples, e o build consegue transformar os mesmos arquivos em entidades importáveis.",
				steps: [
					"Edite catalog/artist.md para a página do artista.",
					"Crie uma pasta por música em catalog/charts/.",
					"Coloque metadados de work e version no frontmatter.",
					"Deixe o corpo como rawText da cifra.",
				],
				code:
					"---\nid: minha-musica-demo\nwork:\n  title: Minha Musica\n---\n[Intro]\nC G Am F",
				memoryPrompt:
					"Sem olhar: onde termina o metadado e começa a cifra?",
				nextQuestion:
					"Peça para o agente validar a estrutura de uma cifra nova.",
			},
			en: {
				label: "Markdown catalog",
				title: "Artist and charts live in human-readable files.",
				summary:
					"Editorial content lives in catalog/artist.md and catalog/charts/<song>/<version>.md. Frontmatter stores metadata; the body stores the raw chord chart.",
				whyItMatters:
					"Contributors can review repertoire in simple pull requests, and the build can turn the same files into importable entities.",
				steps: [
					"Edit catalog/artist.md for the artist page.",
					"Create one folder per song under catalog/charts/.",
					"Put work and version metadata in frontmatter.",
					"Leave the body as the chart rawText.",
				],
				code:
					"---\nid: my-song-demo\nwork:\n  title: My Song\n---\n[Intro]\nC G Am F",
				memoryPrompt:
					"Without looking: where does metadata end and the chart begin?",
				nextQuestion:
					"Ask the agent to validate the structure of a new chart.",
			},
		},
	},
	{
		appId: "artist-portal-base",
		id: "generated-source-catalog",
		source: "../artist-portal-base/README.md, scripts/catalog-core.ts, public/source-catalog/source-manifest.json",
		copy: {
			"pt-BR": {
				label: "Artefatos importáveis",
				title: "O build gera manifest, checksums e NDJSON em /source-catalog/.",
				summary:
					"O portal transforma Markdown em envelopes Source Catalog: artist, musicalWork, playableVersion e chordChart. O manifest lista arquivos e checksums para importação segura.",
				whyItMatters:
					"Essa saída é o contrato entre um site estático público e um app consumidor offline-first.",
				steps: [
					"Carregue o draft do catálogo a partir de catalog/.",
					"Crie envelopes com sourceId, entityType, schemaVersion e payload.",
					"Gere arquivos NDJSON determinísticos por tipo de entidade.",
					"Escreva checksums.json e source-manifest.json.",
				],
				code:
					"pnpm build:catalog\n# public/source-catalog/source-manifest.json\n# public/source-catalog/entities/chord-charts.ndjson",
				memoryPrompt:
					"Sem olhar: quais quatro entidades o catálogo v1 gera por padrão?",
				nextQuestion:
					"Peça para o agente explicar um source-manifest.json linha por linha.",
			},
			en: {
				label: "Importable artifacts",
				title: "The build emits manifest, checksums, and NDJSON under /source-catalog/.",
				summary:
					"The portal turns Markdown into Source Catalog envelopes: artist, musicalWork, playableVersion, and chordChart. The manifest lists files and checksums for safe import.",
				whyItMatters:
					"This output is the contract between a public static site and an offline-first consuming app.",
				steps: [
					"Load the catalog draft from catalog/.",
					"Create envelopes with sourceId, entityType, schemaVersion, and payload.",
					"Generate deterministic NDJSON files per entity type.",
					"Write checksums.json and source-manifest.json.",
				],
				code:
					"pnpm build:catalog\n# public/source-catalog/source-manifest.json\n# public/source-catalog/entities/chord-charts.ndjson",
				memoryPrompt:
					"Without looking: which four entities does the v1 catalog generate by default?",
				nextQuestion:
					"Ask the agent to explain a source-manifest.json line by line.",
			},
		},
	},
	{
		appId: "artist-portal-base",
		id: "validation-pipeline",
		source: "../artist-portal-base/README.md, scripts/validate-catalog.ts, scripts/catalog-core.ts, package.json",
		copy: {
			"pt-BR": {
				label: "Pipeline de validação",
				title: "pnpm build valida antes de publicar o portal.",
				summary:
					"A validação checa frontmatter, IDs duplicados, datas ISO, chaves sensíveis e erros fatais de parse via @achorde/tab-renderer antes de gerar o catálogo.",
				whyItMatters:
					"Um portal público pode ser estático, mas seus dados ainda precisam ser confiáveis para importação automática.",
				steps: [
					"Rode pnpm validate durante edição e CI.",
					"Falhe cedo em metadados ausentes ou duplicados.",
					"Use parseTab para impedir cifras estruturalmente inválidas.",
					"Deixe pnpm build rodar validate, build:catalog e astro build.",
				],
				code:
					"pnpm validate\npnpm build\n# validate -> build:catalog -> astro build",
				memoryPrompt:
					"Sem olhar: por que validar parse de cifra dentro do portal?",
				nextQuestion:
					"Peça para o agente interpretar uma falha de pnpm validate.",
			},
			en: {
				label: "Validation pipeline",
				title: "pnpm build validates before publishing the portal.",
				summary:
					"Validation checks frontmatter, duplicate IDs, ISO dates, sensitive keys, and fatal parse errors through @achorde/tab-renderer before generating the catalog.",
				whyItMatters:
					"A public portal can be static, but its data still must be trustworthy for automatic import.",
				steps: [
					"Run pnpm validate during editing and CI.",
					"Fail early on missing or duplicate metadata.",
					"Use parseTab to reject structurally invalid charts.",
					"Let pnpm build run validate, build:catalog, and astro build.",
				],
				code:
					"pnpm validate\npnpm build\n# validate -> build:catalog -> astro build",
				memoryPrompt:
					"Without looking: why validate chart parsing inside the portal?",
				nextQuestion:
					"Ask the agent to interpret a pnpm validate failure.",
			},
		},
	},
	{
		appId: "artist-portal-base",
		id: "interactive-reader",
		source: "../artist-portal-base/src/components/PortalCatalogReader.tsx, src/pages/index.astro, README.md",
		copy: {
			"pt-BR": {
				label: "Leitor interativo",
				title: "O portal mostra cifras com busca, tom e tamanho de fonte.",
				summary:
					"A página inicial hidrata um componente React que lista as cifras publicadas, filtra por texto, transpõe visualmente e renderiza com @achorde/tab-renderer/react.",
				whyItMatters:
					"O portal precisa servir máquinas, mas também precisa ser útil para humanos antes de qualquer importação no AC15.",
				steps: [
					"Carregue o draft do catálogo no Astro.",
					"Passe charts para PortalCatalogReader.",
					"Controle busca, selectedId, transposeNumber e fontSize em React.",
					"Renderize a cifra selecionada com Tab e links de importação.",
				],
				code:
					"<PortalCatalogReader\n  charts={charts}\n  catalogUrl={catalogUrl}\n  manifestUrl={manifestUrl}\n/>",
				memoryPrompt:
					"Sem olhar: o leitor muda o rawText publicado ou só a visualização?",
				nextQuestion:
					"Peça para o agente comparar o leitor do portal com o viewer do AC15.",
			},
			en: {
				label: "Interactive reader",
				title: "The portal shows charts with search, key, and font-size controls.",
				summary:
					"The home page hydrates a React component that lists published charts, filters by text, visually transposes, and renders through @achorde/tab-renderer/react.",
				whyItMatters:
					"The portal must serve machines, but it also needs to be useful to humans before any AC15 import.",
				steps: [
					"Load the catalog draft in Astro.",
					"Pass charts to PortalCatalogReader.",
					"Control query, selectedId, transposeNumber, and fontSize in React.",
					"Render the selected chart with Tab and import links.",
				],
				code:
					"<PortalCatalogReader\n  charts={charts}\n  catalogUrl={catalogUrl}\n  manifestUrl={manifestUrl}\n/>",
				memoryPrompt:
					"Without looking: does the reader change published rawText or only the view?",
				nextQuestion:
					"Ask the agent to compare the portal reader with the AC15 viewer.",
			},
		},
	},
] as const satisfies readonly AppConceptDoc[];

export function getConceptDocsForPackage(
	packageId: PackageId,
) {
	return packageConceptDocs.filter((conceptDoc) => conceptDoc.packageId === packageId);
}

export function getConceptDocsForApp(
	appId: AppId,
) {
	return appConceptDocs.filter((conceptDoc) => conceptDoc.appId === appId);
}

export function findPackageConceptDoc(
	packageId: string | undefined,
	conceptId: string | undefined,
) {
	return packageConceptDocs.find(
		(conceptDoc) => conceptDoc.packageId === packageId && conceptDoc.id === conceptId,
	);
}

export function findAppConceptDoc(
	appId: string | undefined,
	conceptId: string | undefined,
) {
	return appConceptDocs.find(
		(conceptDoc) => conceptDoc.appId === appId && conceptDoc.id === conceptId,
	);
}

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

export function findAppDoc(appId: string | undefined) {
	return appDocs.find((appDoc) => appDoc.id === appId);
}
