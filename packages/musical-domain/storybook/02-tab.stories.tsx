import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	parsedTabExample,
	tabDecorationTokenExample,
	tabLineExample,
	tabSectionExample,
	tabLyricTokenExample,
	tabTokenExample,
} from "../site/showcase-data.js";
import { StoryCard, StoryCode, StoryGrid, StoryGridTwo, StoryPage, StoryPills } from "./story-components.js";

const meta = {
	title: "02 Tab",
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const TokenDaLinha: Story = {
	render: () => (
		<StoryPage
			kicker="Tab"
			title="O token é o menor pedacinho da linha"
			lead="Cada linha pode ser quebrada em pedacinhos: acorde, espaço, letra ou decoração."
		>
			<StoryGrid>
				<StoryCard title="Token de acorde" eyebrow="Menor unidade útil">
					<StoryCode>{JSON.stringify(tabTokenExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Token de decoração" eyebrow="Parêntese, barra e afins">
					<StoryCode>{JSON.stringify(tabDecorationTokenExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Token de letra" eyebrow="Quando é palavra da música">
					<StoryCode>{JSON.stringify(tabLyricTokenExample, null, 2)}</StoryCode>
				</StoryCard>
			</StoryGrid>
		</StoryPage>
	),
};

export const LinhaDeTab: Story = {
	render: () => (
		<StoryPage
			kicker="Tab"
			title="A linha diz se há acordes ou letra"
			lead="O pacote não tenta adivinhar pela primeira palavra. Ele olha a linha inteira e classifica com calma."
		>
			<StoryGridTwo>
				<StoryCard title="Linha exemplo" eyebrow="Chords">
					<StoryCode>{JSON.stringify(tabLineExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Como ler" eyebrow="Em linguagem simples">
					<StoryPills items={["section-header", "chords", "lyrics", "blank"]} />
					<p className="md-muted">
						São as quatro formas que o pacote aceita para a leitura ficar clara e previsível.
					</p>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

export const SecaoDeTab: Story = {
	render: () => (
		<StoryPage
			kicker="Tab"
			title="Uma seção agrupa linhas parecidas"
			lead="É aqui que o verso ou o refrão ganham um nome e passam a carregar várias linhas na ordem certa."
		>
			<StoryGridTwo>
				<StoryCard title="Seção pronta" eyebrow="Com nome">
					<StoryCode>{JSON.stringify(tabSectionExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Leitura simples" eyebrow="Resumo">
					<p className="md-muted">
						Primeiro vem o título. Depois aparecem linhas de acorde e linha de letra, tudo junto no mesmo bloco.
					</p>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

export const TabCompleta: Story = {
	render: () => (
		<StoryPage
			kicker="Tab"
			title="A tab completa junta tudo"
			lead="Quando todas as seções se reúnem, você vê o texto inteiro, os avisos e os acordes encontrados."
		>
			<StoryGridTwo>
				<StoryCard title="AST completo" eyebrow="Visão geral">
					<StoryCode>{JSON.stringify(parsedTabExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="O que está dentro" eyebrow="Resumo curto">
					<StoryPills items={["body", "sections", "diagnostics", "parserVersion", "astVersion", "chordsFound"]} />
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};
