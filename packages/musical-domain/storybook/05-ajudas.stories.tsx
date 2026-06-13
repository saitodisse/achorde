import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	barreInferenceExample,
	displayBaseFretExample,
	editorPipelineExample,
	fretNotationExample,
	normalizedLabelExample,
	normalizedPipelineExample,
	preferredVoicingExample,
	sampleVoicings,
	voicingExample,
} from "../site/showcase-data.js";
import { StoryCard, StoryCode, StoryGridTwo, StoryPage, StoryPills } from "./story-components.js";

const meta = {
	title: "05 Ferramentas",
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const NormalizacaoDoNome: Story = {
	render: () => (
		<StoryPage
			kicker="Ferramentas"
			title="Normalizar o nome do acorde evita confusão"
			lead="O pacote limpa o texto sem mudar o sentido. Ele só deixa o símbolo mais fácil de comparar."
		>
			<StoryGridTwo>
				<StoryCard title="Resultado normalizado" eyebrow="Pequena mudança">
					<p className="md-standout">{normalizedLabelExample}</p>
					<StoryCode>{`normalizeChordSymbolLabel("C♯maj7") // "${normalizedLabelExample}"`}</StoryCode>
				</StoryCard>
				<StoryCard title="O que isso evita" eyebrow="Texto consistente">
					<StoryPills items={["espaços extras", "variação unicode", "comparações inconsistentes"]} />
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

export const FretNotation: Story = {
	render: () => (
		<StoryPage
			kicker="Ferramentas"
			title="Fret notation transforma uma sequência curta em voicing"
			lead="Isso facilita a vida quando a forma do acorde cabe em uma escrita compacta."
		>
			<StoryGridTwo>
				<StoryCard title="Entrada" eyebrow="Curta">
					<p className="md-standout">{fretNotationExample.input}</p>
					<StoryCode>{JSON.stringify(fretNotationExample.voicing, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Saída" eyebrow="Pronta para usar">
					<StoryCode>{`formatVoicingToFretNotation(voicing) // "${fretNotationExample.formatted}"`}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

export const SelecaoDoMelhorVoicing: Story = {
	render: () => (
		<StoryPage
			kicker="Ferramentas"
			title="Escolher a melhor digitação é uma decisão ordenada"
			lead="A seleção considera qualidade, origem, base do desenho e depois usa o id para desempatar."
		>
			<StoryGridTwo>
				<StoryCard title="Melhor voicing" eyebrow="Escolha final">
					<p className="md-standout">{preferredVoicingExample.id}</p>
					<StoryCode>{JSON.stringify(preferredVoicingExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Lista de candidatos" eyebrow="Comparação">
					<StoryCode>{JSON.stringify(sampleVoicings, null, 2)}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

export const BaseDoDesenho: Story = {
	render: () => (
		<StoryPage
			kicker="Ferramentas"
			title="A base do desenho evita acordes espremidos"
			lead="Se o acorde sobe demais no braço, o pacote escolhe um ponto de partida melhor para o desenho ficar legível."
		>
			<StoryGridTwo>
				<StoryCard title="Base calculada" eyebrow="Quando precisa subir">
					<p className="md-standout">
						{displayBaseFretExample.result ? `casas ${displayBaseFretExample.result}` : "não precisa subir"}
					</p>
					<StoryCode>{JSON.stringify(displayBaseFretExample.voicing, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Regra simples" eyebrow="Resumo">
					<StoryCode>{`resolveVoicingDisplayBaseFret(voicing, 5)`}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

export const InferenciaDeBarre: Story = {
	render: () => (
		<StoryPage
			kicker="Ferramentas"
			title="A pestana pode ser inferida automaticamente"
			lead="O pacote consegue recomputar a pestana a partir do que está pressionado no braço."
		>
			<StoryGridTwo>
				<StoryCard title="Entrada sem pestana salva" eyebrow="Antes">
					<StoryCode>{JSON.stringify(barreInferenceExample.input, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Saída recalculada" eyebrow="Depois">
					<StoryCode>{JSON.stringify(barreInferenceExample.output, null, 2)}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

export const PipelineDoEditor: Story = {
	render: () => (
		<StoryPage
			kicker="Ferramentas"
			title="O pipeline do editor junta várias correções"
			lead="Esse é o passo final: ele ajusta o voicing para ficar pronto para o editor e para o desenho."
		>
			<StoryGridTwo>
				<StoryCard title="Resultado do pipeline" eyebrow="Saída final">
					<StoryCode>{JSON.stringify(editorPipelineExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="O que entra" eyebrow="Base inicial">
					<StoryCode>{JSON.stringify(voicingExample, null, 2)}</StoryCode>
					<p className="md-muted">
						Depois da normalização, o pacote pode remover a base de desenho desnecessária.
					</p>
					<StoryCode>{JSON.stringify(normalizedPipelineExample, null, 2)}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};
