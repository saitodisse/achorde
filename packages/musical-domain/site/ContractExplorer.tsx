import type { ReactNode } from "react";
import { sampleData, demoLinks, exportedGroups } from "./site-data.js";
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
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="md-card">
			<h3>{title}</h3>
			{children}
		</section>
	);
}

export function ContractExplorer() {
	return (
		<div className="md-shell">
			<header className="md-hero">
				<div>
					<p className="md-kicker">@achorde/musical-domain</p>
					<h1>Shared musical contracts, exposed plainly</h1>
					<p className="md-lead">
						This package owns the typed boundary between parsers, renderers, editors and
						apps. The demo below shows the actual exported helpers and the Storybook contains
						a matching contract overview.
					</p>
				</div>

				<div className="md-links">
					<a href={demoLinks.storybook} target="_blank" rel="noreferrer">
						Storybook
					</a>
					<a href={demoLinks.npm} target="_blank" rel="noreferrer">
						npm package
					</a>
				</div>
			</header>

			<main className="md-grid">
				<Card title="Contract version">
					<p className="md-standout">{sampleData.contractVersion}</p>
					<p className="md-muted">
						Used by downstream caches so parser and AST changes are explicit.
					</p>
				</Card>

				<Card title="Export surface">
					<div className="md-pill-grid">
						{exportedGroups.map((group) => (
							<div key={group.title} className="md-pill-group">
								<strong>{group.title}</strong>
								<div className="md-pills">
									{group.items.map((item) => (
										<span key={item}>{item}</span>
									))}
								</div>
							</div>
						))}
					</div>
				</Card>

				<Card title="Label normalization">
					<p className="md-muted">Input: <code>C♯maj7</code></p>
					<p className="md-standout">{sampleData.normalizedLabel}</p>
					<CodeBlock>{`normalizeChordSymbolLabel("C♯maj7") // "${sampleData.normalizedLabel}"`}</CodeBlock>
				</Card>

				<Card title="Fret notation">
					<p className="md-muted">
						<input readOnly value={sampleData.notation} className="md-input" />
					</p>
					<p className="md-standout">{sampleData.recoveredNotation}</p>
					<CodeBlock>{`parseFretNotationToVoicing({ fretNotation: "${sampleData.notation}", chordSymbol: "C", id: "demo" })`}</CodeBlock>
				</Card>

				<Card title="Preferred voicing">
					<p className="md-muted">The helper ranks by quality, source, base fret and id.</p>
					<p className="md-standout">{sampleData.preferredVoicing.id}</p>
					<CodeBlock>{JSON.stringify(sampleData.preferredVoicing, null, 2)}</CodeBlock>
				</Card>

				<Card title="Display base fret">
					<p className="md-muted">Visible fret count: 5</p>
					<p className="md-standout">{String(sampleData.displayBaseFret ?? "none")}</p>
					<CodeBlock>{`resolveVoicingDisplayBaseFret(voicing, 5) // ${sampleData.displayBaseFret ?? "undefined"}`}</CodeBlock>
				</Card>

				<Card title="Parsed tab contract">
					<p className="md-muted">{sampleData.tabExample.preview}</p>
					<CodeBlock>{JSON.stringify(sampleData.tabExample, null, 2)}</CodeBlock>
				</Card>
			</main>

			<footer className="md-footer">
				<a href={demoLinks.demo} target="_blank" rel="noreferrer">
					Open demo
				</a>
				<a href={demoLinks.storybook} target="_blank" rel="noreferrer">
					Open Storybook
				</a>
			</footer>
		</div>
	);
}
