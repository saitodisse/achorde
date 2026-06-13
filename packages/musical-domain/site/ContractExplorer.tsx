import type { ReactNode } from "react";
import {
	chordSpellingExample,
	contractGroups,
	demoLinks,
	displayBaseFretExample,
	editorPipelineExample,
	fretNotationExample,
	learningPath,
	normalizedLabelExample,
	parsedTabExample,
	preferredVoicingExample,
	versionExample,
	voicingExample,
} from "./showcase-data.js";
import "./site.css";

function CodeBlock({ children }: { children: string }) {
	return (
		<pre className="md-code">
			<code>{children}</code>
		</pre>
	);
}

function Card({
	title,
	children,
	eyebrow,
}: {
	title: string;
	children: ReactNode;
	eyebrow?: string;
}) {
	return (
		<section className="md-card">
			{eyebrow ? <p className="md-eyebrow">{eyebrow}</p> : null}
			<h3>{title}</h3>
			{children}
		</section>
	);
}

function ButtonLink({
	href,
	children,
	variant = "ghost",
}: {
	href: string;
	children: ReactNode;
	variant?: "ghost" | "solid";
}) {
	return (
		<a className={`md-button md-button--${variant}`} href={href} target="_blank" rel="noreferrer">
			{children}
		</a>
	);
}

export function ContractExplorer() {
	return (
		<div className="md-shell">
			<header className="md-hero">
				<div className="md-hero-copy">
					<p className="md-kicker">@achorde/musical-domain</p>
					<h1>Contratos musicais explicados de forma simples</h1>
					<p className="md-lead">
						Esse pacote guarda o vocabulário comum entre parser, renderizador, editor e
						aplicações. Aqui você vê primeiro o que ele faz, depois os contratos, e por fim os
						exemplos mais práticos.
					</p>

					<div className="md-hero-actions">
						<ButtonLink href={demoLinks.github} variant="solid">
							GitHub
						</ButtonLink>
						<ButtonLink href={demoLinks.storybook}>Storybook</ButtonLink>
						<ButtonLink href={demoLinks.npm}>npm</ButtonLink>
					</div>
				</div>

				<aside className="md-hero-aside">
					<Card title="Versão do contrato" eyebrow="Começo da leitura">
						<p className="md-standout">{versionExample}</p>
						<p className="md-muted">
							Quando essa versão muda, é porque algum contrato público também mudou.
						</p>
					</Card>
				</aside>
			</header>

			<section className="md-section">
				<div className="md-section-heading">
					<p className="md-kicker">Como ler</p>
					<h2>Siga esta ordem para entender o pacote sem pressa</h2>
					<p className="md-muted">
						Comece do menor pedaço e vá subindo. O Storybook segue exatamente a mesma trilha.
					</p>
				</div>

				<div className="md-step-grid">
					{learningPath.map((item) => (
						<article key={item.step} className="md-step">
							<div className="md-step-badge">{item.step}</div>
							<h3>{item.title}</h3>
							<p>{item.summary}</p>
							<span className="md-step-link">{item.storybookTitle}</span>
						</article>
					))}
				</div>
			</section>

			<section className="md-section">
				<div className="md-section-heading">
					<p className="md-kicker">O que existe</p>
					<h2>Os contratos ficam organizados por família</h2>
				</div>

				<div className="md-grid md-grid--two">
					{contractGroups.map((group) => (
						<Card key={group.title} title={group.title}>
							<div className="md-pill-grid">
								{group.items.map((item) => (
									<span key={item} className="md-pill">
										{item}
									</span>
								))}
							</div>
						</Card>
					))}
				</div>
			</section>

			<section className="md-section">
				<div className="md-section-heading">
					<p className="md-kicker">Exemplos rápidos</p>
					<h2>Pequenos exemplos para fixar o que cada parte faz</h2>
				</div>

				<div className="md-grid">
					<Card title="Símbolo de acorde" eyebrow="Mais simples">
						<p className="md-muted">Exemplo de entrada normalizada.</p>
						<p className="md-standout">{normalizedLabelExample}</p>
						<CodeBlock>{`normalizeChordSymbolLabel("C♯maj7") // "${normalizedLabelExample}"`}</CodeBlock>
					</Card>

					<Card title="Spelling do acorde" eyebrow="Pequeno resumo musical">
						<p className="md-muted">Esse helper separa raiz, qualidade e baixo.</p>
						<CodeBlock>{JSON.stringify(chordSpellingExample, null, 2)}</CodeBlock>
					</Card>

					<Card title="Linha de tab" eyebrow="Texto estruturado">
						<p className="md-muted">Uma linha pode carregar acorde e espaço, mas ainda é só uma linha.</p>
						<CodeBlock>{JSON.stringify(parsedTabExample.sections[0]?.lines[1], null, 2)}</CodeBlock>
					</Card>

					<Card title="Tab completa" eyebrow="Junta tudo">
						<p className="md-muted">
							Quando as linhas se juntam, você tem a leitura inteira da música.
						</p>
						<CodeBlock>{JSON.stringify(parsedTabExample, null, 2)}</CodeBlock>
					</Card>

					<Card title="Voicing" eyebrow="Mais visual">
						<p className="md-muted">Mostra as cordas, os dedos e a pestana do acorde.</p>
						<CodeBlock>{JSON.stringify(voicingExample, null, 2)}</CodeBlock>
					</Card>

					<Card title="Escolha do melhor voicing" eyebrow="Ferramenta de apoio">
						<p className="md-muted">O pacote consegue escolher a digitação mais adequada.</p>
						<CodeBlock>{JSON.stringify(preferredVoicingExample, null, 2)}</CodeBlock>
					</Card>

					<Card title="Pipeline do editor" eyebrow="Resultado final">
						<p className="md-muted">
							Um passo puxa o outro: pega o voicing, ajusta a pestana e decide a base do desenho.
						</p>
						<CodeBlock>{JSON.stringify(editorPipelineExample, null, 2)}</CodeBlock>
					</Card>
				</div>
			</section>

			<section className="md-section">
				<div className="md-section-heading">
					<p className="md-kicker">Detalhes práticos</p>
					<h2>Dois exemplos que ajudam muito no dia a dia</h2>
				</div>

				<div className="md-grid md-grid--two">
					<Card title="Fret notation" eyebrow="Entrada curta">
						<p className="md-muted">
							Em vez de digitar cada corda separadamente, você escreve uma sequência curta.
						</p>
						<p className="md-standout">{fretNotationExample.formatted}</p>
						<CodeBlock>{`parseFretNotationToVoicing({ fretNotation: "${fretNotationExample.input}", chordSymbol: "C", id: "demo" })`}</CodeBlock>
					</Card>

					<Card title="Base do desenho" eyebrow="Quando o acorde sobe no braço">
						<p className="md-muted">
							Se o acorde passa de cinco casas, o pacote decide por onde começar o desenho.
						</p>
						<p className="md-standout">
							{displayBaseFretExample.result ? `casas ${displayBaseFretExample.result}` : "não precisa mover"}
						</p>
						<CodeBlock>{`resolveVoicingDisplayBaseFret(voicing, 5) // ${displayBaseFretExample.result ?? "undefined"}`}</CodeBlock>
					</Card>
				</div>
			</section>

			<section className="md-section">
				<div className="md-section-heading">
					<p className="md-kicker">Compatibilidade</p>
					<h2>Os modelos antigos continuam documentados</h2>
					<p className="md-muted">
						Eles existem para manter integrações antigas funcionando enquanto a base nova é adotada.
					</p>
				</div>

				<Card title="Modelo legado" eyebrow="Apenas para compatibilidade">
					<CodeBlock>{JSON.stringify(parsedTabExample.sections[0], null, 2)}</CodeBlock>
				</Card>
			</section>

			<section className="md-section">
				<div className="md-section-heading">
					<p className="md-kicker">Links</p>
					<h2>Abra o código ou veja o Storybook a qualquer momento</h2>
				</div>

				<div className="md-footer">
					<ButtonLink href={demoLinks.github} variant="solid">
						Abrir GitHub
					</ButtonLink>
					<ButtonLink href={demoLinks.storybook}>Abrir Storybook</ButtonLink>
					<ButtonLink href={demoLinks.demo}>Abrir demo</ButtonLink>
				</div>
			</section>
		</div>
	);
}
