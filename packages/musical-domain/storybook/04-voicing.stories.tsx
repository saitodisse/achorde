import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	barreExample,
	fretStringExample,
	voicingExample,
	voicingWithBarreExample,
} from "../site/showcase-data.js";
import { StoryCard, StoryCode, StoryGridTwo, StoryPage } from "./story-components.js";

const meta = {
	title: "04 Voicing",
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const StringState: Story = {
	render: () => (
		<StoryPage
			kicker="Voicing"
			title="Uma corda é só um pequeno estado"
			lead="Cada corda diz se está solta, abafada ou apertada em uma casa específica."
		>
			<StoryGridTwo>
				<StoryCard title="Corda individual" eyebrow="Menor bloco">
					<StoryCode>{JSON.stringify(fretStringExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Pestana" eyebrow="A mesma casa para várias cordas">
					<StoryCode>{JSON.stringify(barreExample, null, 2)}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

export const VoicingCompleto: Story = {
	render: () => (
		<StoryPage
			kicker="Voicing"
			title="O voicing mostra o acorde no braço"
			lead="Aqui já aparecem todas as cordas, a nota aberta, a pestana e a qualidade do desenho."
		>
			<StoryGridTwo>
				<StoryCard title="Voicing sem pestana" eyebrow="Exemplo simples">
					<StoryCode>{JSON.stringify(voicingExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Voicing com pestana" eyebrow="Exemplo visual">
					<StoryCode>{JSON.stringify(voicingWithBarreExample, null, 2)}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

