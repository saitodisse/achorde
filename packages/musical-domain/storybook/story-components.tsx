import type { ReactNode } from "react";

export function StoryPage({
	kicker,
	title,
	lead,
	children,
	footer,
}: {
	kicker: string;
	title: string;
	lead: string;
	children: ReactNode;
	footer?: ReactNode;
}) {
	return (
		<div className="md-shell">
			<header className="md-hero">
				<div className="md-hero-copy">
					<p className="md-kicker">{kicker}</p>
					<h1>{title}</h1>
					<p className="md-lead">{lead}</p>
				</div>
			</header>
			<div className="md-section">{children}</div>
			{footer ? <footer className="md-footer">{footer}</footer> : null}
		</div>
	);
}

export function StoryCard({
	title,
	eyebrow,
	children,
}: {
	title: string;
	eyebrow?: string;
	children: ReactNode;
}) {
	return (
		<section className="md-card">
			{eyebrow ? <p className="md-eyebrow">{eyebrow}</p> : null}
			<h3>{title}</h3>
			{children}
		</section>
	);
}

export function StoryGrid({ children }: { children: ReactNode }) {
	return <div className="md-grid">{children}</div>;
}

export function StoryGridTwo({ children }: { children: ReactNode }) {
	return <div className="md-grid md-grid--two">{children}</div>;
}

export function StoryPills({ items }: { items: ReadonlyArray<string> }) {
	return (
		<div className="md-pill-grid">
			{items.map((item) => (
				<span key={item} className="md-pill">
					{item}
				</span>
			))}
		</div>
	);
}

export function StoryCode({ children }: { children: string }) {
	return (
		<pre className="md-code">
			<code>{children}</code>
		</pre>
	);
}

