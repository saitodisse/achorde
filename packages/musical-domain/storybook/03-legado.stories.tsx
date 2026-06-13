import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	legacyChordChartAstExample,
	legacyChordChartExample,
	legacyLineExample,
	legacySectionExample,
} from "../site/showcase-data.js";
import { StoryCard, StoryCode, StoryGridTwo, StoryPage } from "./story-components.js";

const meta = {
	title: "03 Compatibilidade/Legado",
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ChordChartAstLegado: Story = {
	render: () => (
		<StoryPage
			kicker="Compatibilidade"
			title="Os contratos antigos continuam documentados"
			lead="Eles ainda existem para leitura de sistemas antigos, mas o pacote já mostra que o caminho novo é o ParsedTab."
		>
			<StoryGridTwo>
				<StoryCard title="ChordChartAst" eyebrow="Formato antigo">
					<StoryCode>{JSON.stringify(legacyChordChartAstExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="ParsedChordChart" eyebrow="Com diagnósticos">
					<StoryCode>{JSON.stringify(legacyChordChartExample, null, 2)}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
			<StoryCard title="Linha antiga" eyebrow="Também preservada">
				<StoryCode>{JSON.stringify(legacyLineExample, null, 2)}</StoryCode>
			</StoryCard>
			<StoryCard title="Seção antiga" eyebrow="Compatibilidade completa">
				<StoryCode>{JSON.stringify(legacySectionExample, null, 2)}</StoryCode>
			</StoryCard>
		</StoryPage>
	),
};

