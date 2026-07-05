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
	},
} as const;

export const packageDocs = [
	{
		id: "musical-domain",
		name: "@achorde/musical-domain",
		scope: "contracts",
		npm: "https://www.npmjs.com/package/@achorde/musical-domain",
		demo: "https://achorde-musical-domain.vercel.app/",
		storybook: "https://storybook-musical-domain.vercel.app/",
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
