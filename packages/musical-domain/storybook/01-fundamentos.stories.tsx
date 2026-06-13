import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	chordSpellingExample,
	diagnosticExample,
	parsedChordSymbolExample,
	parsedChordSymbolWithBassExample,
	versionExample,
} from "../site/showcase-data.js";
import { StoryCard, StoryCode, StoryGridTwo, StoryPage, StoryPills } from "./story-components.js";

const meta = {
	title: "01 Fundamentos",
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const VersaoDoContrato: Story = {
	render: () => (
		<StoryPage
			kicker="Fundamentos"
			title="A versão do contrato é o carimbo do pacote"
			lead="Ela serve para avisar para outros sistemas quando alguma forma de dado mudou. É um jeito claro de evitar surpresa."
		>
			<StoryGridTwo>
				<StoryCard title="Versão atual" eyebrow="Dado básico">
					<p className="md-standout">{versionExample}</p>
					<p className="md-muted">
						Essa versão acompanha o formato público dos contratos, não a aparência da página.
					</p>
				</StoryCard>
				<StoryCard title="Por que isso importa" eyebrow="Explicação curta">
					<StoryCode>{`if (contractVersion changes) { downstream systems review types }`}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

export const AvisoDeErro: Story = {
	render: () => (
		<StoryPage
			kicker="Fundamentos"
			title="Um diagnóstico explica o que deu errado"
			lead="Quando a leitura encontra algo estranho, o pacote devolve um aviso pequeno e objetivo. Assim fica fácil apontar o problema."
		>
			<StoryGridTwo>
				<StoryCard title="Exemplo de aviso" eyebrow="Erro claro">
					<p className="md-muted">{diagnosticExample.message}</p>
					<StoryCode>{JSON.stringify(diagnosticExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Leitura simples" eyebrow="Para leigo">
					<p className="md-muted">
						O aviso mostra onde a leitura falhou, para o sistema ou a pessoa corrigirem só o trecho necessário.
					</p>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

export const SimboloDeAcorde: Story = {
	render: () => (
		<StoryPage
			kicker="Fundamentos"
			title="O símbolo do acorde é a peça menor"
			lead="Antes de desenhar qualquer coisa, o pacote primeiro entende o nome do acorde e separa raiz, qualidade e baixo."
		>
			<StoryGridTwo>
				<StoryCard title="Acorde com sustenido" eyebrow="Estrutura principal">
					<p className="md-muted">Um símbolo simples vira um objeto pequeno e legível.</p>
					<StoryCode>{JSON.stringify(parsedChordSymbolExample, null, 2)}</StoryCode>
				</StoryCard>
				<StoryCard title="Acorde com baixo" eyebrow="Um detalhe a mais">
					<p className="md-muted">Às vezes o acorde diz também qual nota vai no baixo.</p>
					<StoryCode>{JSON.stringify(parsedChordSymbolWithBassExample, null, 2)}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
		</StoryPage>
	),
};

export const IntegracaoComTeoria: Story = {
	render: () => (
		<StoryPage
			kicker="Fundamentos"
			title="O adaptador de teoria musical é só uma ponte"
			lead="O pacote não obriga você a usar uma biblioteca específica de teoria. Em vez disso, ele recebe um adaptador simples."
		>
			<StoryGridTwo>
				<StoryCard title="Formato do adaptador" eyebrow="Contrato de entrada">
					<StoryPills
						items={[
							"transposePitchClass",
							"parseChordSymbol",
							"getChordNotes",
							"detectChord",
						]}
					/>
					<StoryCode>{`type MusicTheoryAdapter = {
  transposePitchClass(note, semitones): string;
  parseChordSymbol(symbol): ParsedChordSymbol | null;
  getChordNotes(symbol): string[];
  detectChord(notes): string[];
}`}</StoryCode>
				</StoryCard>
				<StoryCard title="O que ele faz" eyebrow="Sem dependência dura">
					<p className="md-muted">
						Ele sabe transpor nota, ler símbolo, descobrir notas do acorde e reconhecer um acorde a partir das notas.
					</p>
					<StoryCode>{`transposePitchClass() / parseChordSymbol() / getChordNotes() / detectChord()`}</StoryCode>
				</StoryCard>
			</StoryGridTwo>
			<StoryCard title="Exemplo de metadado de acorde" eyebrow="Pequeno e claro">
				<StoryCode>{JSON.stringify(chordSpellingExample, null, 2)}</StoryCode>
			</StoryCard>
		</StoryPage>
	),
};
