import type { Meta, StoryObj } from "@storybook/react-vite";
import { demoLinks, learningPath } from "../site/showcase-data.js";
import {
	StoryCard,
	StoryCode,
	StoryGridTwo,
	StoryPage,
	StoryPills,
} from "./story-components.js";

const meta = {
	title: "00 Introdução/Comece aqui",
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisaoGeral: Story = {
	render: () => (
		<StoryPage
			kicker="@achorde/musical-domain"
			title="Comece por aqui"
			lead="Esta página mostra a ordem certa para entender os contratos. O objetivo é começar pelo mais simples e ir subindo até chegar nas estruturas maiores."
			footer={
				<>
					<a className="md-button md-button--solid" href={demoLinks.github} target="_blank" rel="noreferrer">
						GitHub
					</a>
					<a className="md-button" href={demoLinks.storybook} target="_blank" rel="noreferrer">
						Storybook
					</a>
				</>
			}
		>
			<StoryGridTwo>
				{learningPath.map((item) => (
					<StoryCard key={item.step} title={item.title} eyebrow={`Passo ${item.step}`}>
						<p className="md-muted">{item.summary}</p>
						<p className="md-step-link">{item.storybookTitle}</p>
					</StoryCard>
				))}
				<StoryCard title="Como usar" eyebrow="Leitura rápida">
					<StoryPills
						items={[
							"Leia a visão geral",
							"Abra o story do contrato",
							"Olhe o JSON do exemplo",
							"Compare com a explicação",
						]}
					/>
				</StoryCard>
				<StoryCard title="O que você não precisa saber" eyebrow="Sem complicar">
					<p className="md-muted">
						Você não precisa entender tudo de uma vez. Cada story mostra um pedaço pequeno.
					</p>
					<StoryCode>{`storybook -> contrato -> exemplo -> entendimento`}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

