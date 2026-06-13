import type { Meta, StoryObj } from "@storybook/react-vite";
import { StoryCard, StoryCode, StoryGridTwo, StoryPage, StoryPills } from "./story-components.js";

const meta = {
	title: "06 Integração/Adaptador",
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const AdaptadorDeTeoriaMusical: Story = {
	render: () => (
		<StoryPage
			kicker="Integração"
			title="O adaptador é uma ponte, não uma prisão"
			lead="Se você já tem uma biblioteca de teoria musical, o pacote apenas conversa com ela por uma interface pequena."
		>
			<StoryGridTwo>
				<StoryCard title="Contrato do adaptador" eyebrow="A forma esperada">
					<StoryPills
						items={[
							"transposePitchClass",
							"parseChordSymbol",
							"getChordNotes",
							"detectChord",
						]}
					/>
					<StoryCode>{`const adapter: MusicTheoryAdapter = {
  transposePitchClass(note, semitones) { ... },
  parseChordSymbol(symbol) { ... },
  getChordNotes(symbol) { ... },
  detectChord(notes) { ... },
};`}</StoryCode>
				</StoryCard>
				<StoryCard title="Resumo simples" eyebrow="O que faz">
					<StoryCode>{`transposePitchClass() / parseChordSymbol() / getChordNotes() / detectChord()`}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};
