import {
	Link,
	Outlet,
	RouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy, type ReactNode } from "react";
import {
	type AppConceptDoc,
	type AppDoc,
	type Locale,
	type PackageDoc,
	type PackageConceptDoc,
	appConceptDocs,
	appDocs,
	getConceptDocsForApp,
	getConceptDocsForPackage,
	localeFromRoute,
	locales,
	oppositeLocale,
	packageConceptDocs,
	packageDocs,
	routeLocale,
	siteCopy,
} from "./docs-content.js";
import { packageReadmes } from "./package-readmes.js";
import "./site.css";

type ConceptDoc = PackageConceptDoc | AppConceptDoc;

const MarkdownReadme = lazy(() =>
	import("./MarkdownReadme.js").then((module) => ({
		default: module.MarkdownReadme,
	})),
);

function ReadmeFallback({ children }: { children: string }) {
	return <p className="docs-readme-loading">{children}</p>;
}

const ecosystemPrinciples = {
	"pt-BR": [
		"ACHORDE guarda bibliotecas públicas reutilizáveis; AC15 guarda produto, persistência, sync e preferências.",
		"Dados musicais genéricos vivem em contratos públicos; regras privadas do produto continuam no AC15.",
		"Portais publicam catálogos estáticos validados; o AC15 importa, preserva proveniência e não promove verdade externa sem decisão explícita.",
		"Voicings de guitarra usam ordem baixo-para-alto: stringIndex 1 é Mi grave e stringIndex 6 é Mi agudo.",
	],
	en: [
		"ACHORDE holds reusable public libraries; AC15 owns product behavior, persistence, sync, and preferences.",
		"Generic musical data belongs in public contracts; private product rules remain in AC15.",
		"Portals publish validated static catalogs; AC15 imports them, preserves provenance, and does not promote external truth silently.",
		"Guitar voicings use low-to-high order: stringIndex 1 is low E and stringIndex 6 is high E.",
	],
} as const;

const packageOrder = packageDocs.map((packageDoc) => packageDoc.id);
const appOrder = appDocs.map((appDoc) => appDoc.id);

function packagePath(locale: Locale, packageId: PackageDoc["id"]) {
	return `/${routeLocale(locale)}/packages/${packageId}`;
}

function appPath(locale: Locale, appId: AppDoc["id"]) {
	return `/${routeLocale(locale)}/apps/${appId}`;
}

function packageConceptPath(
	locale: Locale,
	packageId: PackageDoc["id"],
	conceptId: PackageConceptDoc["id"],
) {
	return `/${routeLocale(locale)}/packages/${packageId}/concepts/${conceptId}`;
}

function appConceptPath(
	locale: Locale,
	appId: AppDoc["id"],
	conceptId: AppConceptDoc["id"],
) {
	return `/${routeLocale(locale)}/apps/${appId}/concepts/${conceptId}`;
}

function conceptDocPath(locale: Locale, conceptDoc: ConceptDoc) {
	return "packageId" in conceptDoc
		? packageConceptPath(locale, conceptDoc.packageId, conceptDoc.id)
		: appConceptPath(locale, conceptDoc.appId, conceptDoc.id);
}

function homePath(locale: Locale) {
	return `/${routeLocale(locale)}`;
}

function Shell({
	children,
	locale,
	activePackageId,
	activeAppId,
	activeConceptId,
}: {
	children: ReactNode;
	locale: Locale;
	activePackageId?: PackageDoc["id"];
	activeAppId?: AppDoc["id"];
	activeConceptId?: string;
}) {
	const copy = siteCopy[locale];
	const otherLocale = oppositeLocale(locale);
	const conceptDocs = activePackageId
		? getConceptDocsForPackage(activePackageId)
		: activeAppId
			? getConceptDocsForApp(activeAppId)
			: [];
	const otherLocalePath = activeConceptId && activePackageId
		? packageConceptPath(otherLocale, activePackageId, activeConceptId)
		: activeConceptId && activeAppId
			? appConceptPath(otherLocale, activeAppId, activeConceptId)
		: activePackageId
			? packagePath(otherLocale, activePackageId)
			: activeAppId
				? appPath(otherLocale, activeAppId)
			: homePath(otherLocale);

	return (
		<div className="docs-shell">
			<aside className="docs-sidebar" aria-label={copy.allPackages}>
				<div className="docs-brand">
					<Link to={homePath(locale)} className="docs-brand-link">
						<span className="docs-mark">A</span>
						<span>
							<strong>{copy.title}</strong>
							<small>{copy.kicker}</small>
						</span>
					</Link>
				</div>

				<nav className="docs-nav" aria-label={copy.packageRoutes}>
					<Link
						to={homePath(locale)}
						className="docs-nav-link"
						activeOptions={{ exact: true }}
					>
						{copy.startHere}
					</Link>
					<p className="docs-nav-heading">{copy.allPackages}</p>
					{packageDocs.map((packageDoc) => (
						<Link
							key={packageDoc.id}
							to={packagePath(locale, packageDoc.id)}
							className="docs-nav-link"
						>
							<span>{packageDoc.name.replace("@achorde/", "")}</span>
							<small>{packageDoc.summary[locale].label}</small>
						</Link>
					))}
					<p className="docs-nav-heading docs-nav-heading--spaced">
						{copy.allApps}
					</p>
					{appDocs.map((appDoc) => (
						<Link
							key={appDoc.id}
							to={appPath(locale, appDoc.id)}
							className="docs-nav-link"
						>
							<span>{appDoc.name}</span>
							<small>{appDoc.summary[locale].label}</small>
						</Link>
					))}
				</nav>

				{conceptDocs.length > 0 ? (
					<nav className="docs-concept-nav" aria-label={copy.conceptRoutes}>
						<p className="docs-nav-heading">{copy.conceptRoutes}</p>
						{conceptDocs.map((conceptDoc) => {
							const concept = conceptDoc.copy[locale];
							return (
								<Link
									key={conceptDoc.id}
									to={conceptDocPath(locale, conceptDoc)}
									className="docs-concept-nav-link"
								>
									<span>{concept.label}</span>
									<small>{concept.title}</small>
								</Link>
							);
						})}
					</nav>
				) : null}
			</aside>

			<main className="docs-main">
				<header className="docs-topbar">
					<div>
						<p className="docs-kicker">{copy.language}</p>
						<div className="docs-lang-switch" aria-label={copy.language}>
							<Link to={homePath(locale)} className="docs-lang" activeOptions={{ exact: true }}>
								{locales[locale].shortLabel}
							</Link>
							<Link to={otherLocalePath} className="docs-lang">
								{locales[otherLocale].shortLabel}
							</Link>
						</div>
					</div>
					<a
						className="docs-source-link"
						href="https://github.com/saitodisse/achorde"
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</a>
				</header>

				{children}
			</main>
		</div>
	);
}

function HomePage({ locale }: { locale: Locale }) {
	const copy = siteCopy[locale];

	return (
		<Shell locale={locale}>
			<section className="docs-intro">
				<div className="docs-intro-copy">
					<p className="docs-kicker">{copy.kicker}</p>
					<h1>{copy.headline}</h1>
					<p>{copy.intro}</p>
				</div>
				<div className="docs-system-map" aria-label={copy.packageRoutes}>
					{packageDocs.map((packageDoc) => (
						<Link
							key={packageDoc.id}
							to={packagePath(locale, packageDoc.id)}
							className={`docs-map-node docs-map-node--${packageDoc.scope}`}
						>
							<strong>{packageDoc.name.replace("@achorde/", "")}</strong>
							<span>{packageDoc.summary[locale].label}</span>
						</Link>
					))}
					{appDocs.map((appDoc) => (
						<Link
							key={appDoc.id}
							to={appPath(locale, appDoc.id)}
							className={`docs-map-node docs-map-node--${appDoc.scope}`}
						>
							<strong>{appDoc.name}</strong>
							<span>{appDoc.summary[locale].label}</span>
						</Link>
					))}
				</div>
			</section>

			<section className="docs-section">
				<div className="docs-section-heading">
					<p className="docs-kicker">AC15</p>
					<h2>{copy.startHere}</h2>
					<p>{copy.startHereText}</p>
				</div>
				<div className="docs-principles">
					{ecosystemPrinciples[locale].map((principle) => (
						<p key={principle}>{principle}</p>
					))}
				</div>
			</section>

			<section className="docs-section">
				<div className="docs-section-heading">
					<p className="docs-kicker">{copy.packageRoutes}</p>
					<h2>{copy.levelsTitle}</h2>
					<p>{copy.packageRoutesText}</p>
				</div>
				<div className="docs-package-grid">
					{packageDocs.map((packageDoc) => (
						<PackageSummaryCard key={packageDoc.id} packageDoc={packageDoc} locale={locale} />
					))}
				</div>
			</section>

			<section className="docs-section">
				<div className="docs-section-heading">
					<p className="docs-kicker">{copy.appRoutes}</p>
					<h2>{copy.allApps}</h2>
					<p>{copy.appRoutesText}</p>
				</div>
				<div className="docs-package-grid">
					{appDocs.map((appDoc) => (
						<AppSummaryCard key={appDoc.id} appDoc={appDoc} locale={locale} />
					))}
				</div>
			</section>
		</Shell>
	);
}

function PackageSummaryCard({
	packageDoc,
	locale,
}: {
	packageDoc: PackageDoc;
	locale: Locale;
}) {
	const summary = packageDoc.summary[locale];
	return (
		<Link to={packagePath(locale, packageDoc.id)} className="docs-package-card">
			<p className="docs-card-label">{summary.label}</p>
			<h3>{packageDoc.name}</h3>
			<p>{summary.headline}</p>
		</Link>
	);
}

function AppSummaryCard({
	appDoc,
	locale,
}: {
	appDoc: AppDoc;
	locale: Locale;
}) {
	const summary = appDoc.summary[locale];
	return (
		<Link to={appPath(locale, appDoc.id)} className="docs-package-card">
			<p className="docs-card-label">{summary.label}</p>
			<h3>{appDoc.name}</h3>
			<p>{summary.headline}</p>
		</Link>
	);
}

function PackagePage({
	locale,
	packageDoc,
}: {
	locale: Locale;
	packageDoc: PackageDoc;
}) {
	const copy = siteCopy[locale];
	const summary = packageDoc.summary[locale];
	const currentIndex = packageOrder.indexOf(packageDoc.id);
	const nextPackageId = packageOrder[(currentIndex + 1) % packageOrder.length]!;
	const nextPackage = packageDocs.find((item) => item.id === nextPackageId)!;
	const conceptDocs = getConceptDocsForPackage(packageDoc.id);

	return (
		<Shell locale={locale} activePackageId={packageDoc.id}>
			<article className="docs-package-page">
				<header className="docs-package-header">
					<div>
						<p className="docs-kicker">{summary.label}</p>
						<h1>{packageDoc.name}</h1>
					</div>
					<ExternalLinks packageDoc={packageDoc} locale={locale} />
				</header>

				<section className="docs-teach-block">
					<p className="docs-block-label">{copy.headlineLabel}</p>
					<h2>{summary.headline}</h2>
				</section>

				<section className="docs-teach-block">
					<p className="docs-block-label">{copy.paragraphLabel}</p>
					<p>{summary.paragraph}</p>
				</section>

				<section className="docs-teach-block">
					<p className="docs-block-label">{copy.stepsLabel}</p>
					<ol className="docs-steps">
						{summary.steps.map((step) => (
							<li key={step}>{step}</li>
						))}
					</ol>
				</section>

				{conceptDocs.length > 0 ? (
					<section className="docs-section docs-section--inside">
						<div className="docs-section-heading">
							<p className="docs-kicker">{copy.conceptRoutes}</p>
							<h2>{copy.coreConceptsTitle}</h2>
							<p>{copy.coreConceptsText}</p>
						</div>
						<div className="docs-concept-grid">
							{conceptDocs.map((conceptDoc) => (
								<ConceptSummaryCard
									key={conceptDoc.id}
									conceptDoc={conceptDoc}
									locale={locale}
								/>
							))}
						</div>
					</section>
				) : null}

				<div className="docs-two-column">
					<section className="docs-note">
						<p className="docs-block-label">{copy.whenToUseLabel}</p>
						<p>{summary.whenToUse}</p>
					</section>
					<section className="docs-note">
						<p className="docs-block-label">{copy.rememberLabel}</p>
						<p>{summary.remember}</p>
					</section>
				</div>

				<section className="docs-memory-check">
					<p className="docs-block-label">{copy.retrievalTitle}</p>
					<p>{copy.retrievalPrompt}</p>
				</section>

				<section className="docs-readme">
					<p className="docs-block-label">{copy.readmeLabel}</p>
					<Suspense fallback={<ReadmeFallback>{copy.readmeLoading}</ReadmeFallback>}>
						<MarkdownReadme fallback={copy.readmeLoading}>
							{packageReadmes[packageDoc.id]}
						</MarkdownReadme>
					</Suspense>
				</section>

				<footer className="docs-next">
					<span>{locale === "pt-BR" ? "Próximo pacote" : "Next package"}</span>
					<Link to={packagePath(locale, nextPackage.id)}>{nextPackage.name}</Link>
				</footer>
			</article>
		</Shell>
	);
}

function AppPage({
	locale,
	appDoc,
}: {
	locale: Locale;
	appDoc: AppDoc;
}) {
	const copy = siteCopy[locale];
	const summary = appDoc.summary[locale];
	const currentIndex = appOrder.indexOf(appDoc.id);
	const nextAppId = appOrder[(currentIndex + 1) % appOrder.length]!;
	const nextApp = appDocs.find((item) => item.id === nextAppId)!;
	const conceptDocs = getConceptDocsForApp(appDoc.id);

	return (
		<Shell locale={locale} activeAppId={appDoc.id}>
			<article className="docs-package-page">
				<header className="docs-package-header">
					<div>
						<p className="docs-kicker">{summary.label}</p>
						<h1>{appDoc.name}</h1>
					</div>
					<ExternalAppLinks appDoc={appDoc} locale={locale} />
				</header>

				<section className="docs-teach-block">
					<p className="docs-block-label">{copy.headlineLabel}</p>
					<h2>{summary.headline}</h2>
				</section>

				<section className="docs-teach-block">
					<p className="docs-block-label">{copy.paragraphLabel}</p>
					<p>{summary.paragraph}</p>
				</section>

				<section className="docs-teach-block">
					<p className="docs-block-label">{copy.stepsLabel}</p>
					<ol className="docs-steps">
						{summary.steps.map((step) => (
							<li key={step}>{step}</li>
						))}
					</ol>
				</section>

				<section className="docs-section docs-section--inside">
					<div className="docs-section-heading">
						<p className="docs-kicker">{copy.conceptRoutes}</p>
						<h2>{copy.coreConceptsTitle}</h2>
						<p>{copy.coreConceptsText}</p>
					</div>
					<div className="docs-concept-grid">
						{conceptDocs.map((conceptDoc) => (
							<AppConceptSummaryCard
								key={conceptDoc.id}
								conceptDoc={conceptDoc}
								locale={locale}
							/>
						))}
					</div>
				</section>

				<div className="docs-two-column">
					<section className="docs-note">
						<p className="docs-block-label">{copy.whenToUseLabel}</p>
						<p>{summary.whenToUse}</p>
					</section>
					<section className="docs-note">
						<p className="docs-block-label">{copy.rememberLabel}</p>
						<p>{summary.remember}</p>
					</section>
				</div>

				<section className="docs-memory-check">
					<p className="docs-block-label">{copy.retrievalTitle}</p>
					<p>{copy.retrievalPrompt}</p>
				</section>

				<section className="docs-readme">
					<p className="docs-block-label">{copy.sourceDocumentsLabel}</p>
					<ul className="docs-source-list">
						{appDoc.sources.map((source) => (
							<li key={source}>
								<code>{source}</code>
							</li>
						))}
					</ul>
				</section>

				<footer className="docs-next">
					<span>{locale === "pt-BR" ? "Próximo app" : "Next app"}</span>
					<Link to={appPath(locale, nextApp.id)}>{nextApp.name}</Link>
				</footer>
			</article>
		</Shell>
	);
}

function ConceptSummaryCard({
	conceptDoc,
	locale,
}: {
	conceptDoc: PackageConceptDoc;
	locale: Locale;
}) {
	const concept = conceptDoc.copy[locale];
	return (
		<Link
			to={packageConceptPath(locale, conceptDoc.packageId, conceptDoc.id)}
			className="docs-concept-card"
		>
			<p className="docs-card-label">{concept.label}</p>
			<h3>{concept.title}</h3>
			<p>{concept.summary}</p>
		</Link>
	);
}

function AppConceptSummaryCard({
	conceptDoc,
	locale,
}: {
	conceptDoc: AppConceptDoc;
	locale: Locale;
}) {
	const concept = conceptDoc.copy[locale];
	return (
		<Link
			to={appConceptPath(locale, conceptDoc.appId, conceptDoc.id)}
			className="docs-concept-card"
		>
			<p className="docs-card-label">{concept.label}</p>
			<h3>{concept.title}</h3>
			<p>{concept.summary}</p>
		</Link>
	);
}

function ConceptCodeBlock({ children }: { children: string }) {
	return (
		<pre className="docs-code-block">
			<code>{children}</code>
		</pre>
	);
}

function PackageConceptPage({
	locale,
	conceptDoc,
}: {
	locale: Locale;
	conceptDoc: PackageConceptDoc;
}) {
	const copy = siteCopy[locale];
	const concept = conceptDoc.copy[locale];
	const conceptDocs = getConceptDocsForPackage(conceptDoc.packageId);
	const packageDoc = packageDocs.find((item) => item.id === conceptDoc.packageId)!;
	const currentIndex = conceptDocs.findIndex(
		(item) => item.id === conceptDoc.id,
	);
	const nextConcept =
		conceptDocs[(currentIndex + 1) % conceptDocs.length]!;

	return (
		<Shell
			locale={locale}
			activePackageId={conceptDoc.packageId}
			activeConceptId={conceptDoc.id}
		>
			<article className="docs-package-page docs-concept-page">
				<header className="docs-package-header">
					<div>
						<p className="docs-kicker">{concept.label}</p>
						<h1>{concept.title}</h1>
					</div>
					<div className="docs-actions">
						<Link to={packagePath(locale, conceptDoc.packageId)}>
							{copy.backToPackage}
						</Link>
					</div>
				</header>

				<section className="docs-teach-block docs-teach-block--lead">
					<p>{concept.summary}</p>
				</section>

				<div className="docs-two-column">
					<section className="docs-note">
						<p className="docs-block-label">{copy.whyItMattersLabel}</p>
						<p>{concept.whyItMatters}</p>
					</section>
					<section className="docs-note">
						<p className="docs-block-label">{copy.sourceLabel}</p>
						<p>{conceptDoc.source}</p>
					</section>
				</div>

				<section className="docs-teach-block">
					<p className="docs-block-label">{copy.stepsLabel}</p>
					<ol className="docs-steps">
						{concept.steps.map((step) => (
							<li key={step}>{step}</li>
						))}
					</ol>
				</section>

				<section className="docs-teach-block">
					<p className="docs-block-label">TypeScript</p>
					<ConceptCodeBlock>{concept.code}</ConceptCodeBlock>
				</section>

				<section className="docs-memory-check">
					<p className="docs-block-label">{copy.retrievalTitle}</p>
					<p>{concept.memoryPrompt}</p>
				</section>

				<section className="docs-note">
					<p className="docs-block-label">{copy.nextQuestionLabel}</p>
					<p>{concept.nextQuestion}</p>
				</section>

				<footer className="docs-next">
					<span>{locale === "pt-BR" ? "Próximo conceito" : "Next concept"}</span>
					<Link to={packageConceptPath(locale, packageDoc.id, nextConcept.id)}>
						{nextConcept.copy[locale].label}
					</Link>
				</footer>
			</article>
		</Shell>
	);
}

function AppConceptPage({
	locale,
	conceptDoc,
}: {
	locale: Locale;
	conceptDoc: AppConceptDoc;
}) {
	const copy = siteCopy[locale];
	const concept = conceptDoc.copy[locale];
	const conceptDocs = getConceptDocsForApp(conceptDoc.appId);
	const appDoc = appDocs.find((item) => item.id === conceptDoc.appId)!;
	const currentIndex = conceptDocs.findIndex(
		(item) => item.id === conceptDoc.id,
	);
	const nextConcept =
		conceptDocs[(currentIndex + 1) % conceptDocs.length]!;

	return (
		<Shell
			locale={locale}
			activeAppId={conceptDoc.appId}
			activeConceptId={conceptDoc.id}
		>
			<article className="docs-package-page docs-concept-page">
				<header className="docs-package-header">
					<div>
						<p className="docs-kicker">{concept.label}</p>
						<h1>{concept.title}</h1>
					</div>
					<div className="docs-actions">
						<Link to={appPath(locale, conceptDoc.appId)}>
							{copy.backToApp}
						</Link>
					</div>
				</header>

				<section className="docs-teach-block docs-teach-block--lead">
					<p>{concept.summary}</p>
				</section>

				<div className="docs-two-column">
					<section className="docs-note">
						<p className="docs-block-label">{copy.whyItMattersLabel}</p>
						<p>{concept.whyItMatters}</p>
					</section>
					<section className="docs-note">
						<p className="docs-block-label">{copy.sourceLabel}</p>
						<p>{conceptDoc.source}</p>
					</section>
				</div>

				<section className="docs-teach-block">
					<p className="docs-block-label">{copy.stepsLabel}</p>
					<ol className="docs-steps">
						{concept.steps.map((step) => (
							<li key={step}>{step}</li>
						))}
					</ol>
				</section>

				<section className="docs-teach-block">
					<p className="docs-block-label">TypeScript</p>
					<ConceptCodeBlock>{concept.code}</ConceptCodeBlock>
				</section>

				<section className="docs-memory-check">
					<p className="docs-block-label">{copy.retrievalTitle}</p>
					<p>{concept.memoryPrompt}</p>
				</section>

				<section className="docs-note">
					<p className="docs-block-label">{copy.nextQuestionLabel}</p>
					<p>{concept.nextQuestion}</p>
				</section>

				<footer className="docs-next">
					<span>{locale === "pt-BR" ? "Próximo conceito" : "Next concept"}</span>
					<Link to={appConceptPath(locale, appDoc.id, nextConcept.id)}>
						{nextConcept.copy[locale].label}
					</Link>
				</footer>
			</article>
		</Shell>
	);
}

function ExternalLinks({
	packageDoc,
	locale,
}: {
	packageDoc: PackageDoc;
	locale: Locale;
}) {
	const copy = siteCopy[locale];
	return (
		<div className="docs-actions">
			{packageDoc.demo ? (
				<a href={packageDoc.demo} target="_blank" rel="noreferrer">
					{copy.openDemo}
				</a>
			) : null}
			{packageDoc.storybook ? (
				<a href={packageDoc.storybook} target="_blank" rel="noreferrer">
					{copy.openStorybook}
				</a>
			) : null}
			{packageDoc.npm ? (
				<a href={packageDoc.npm} target="_blank" rel="noreferrer">
					{copy.openNpm}
				</a>
			) : null}
			<a href={packageDoc.github} target="_blank" rel="noreferrer">
				{copy.openGithub}
			</a>
		</div>
	);
}

function ExternalAppLinks({
	appDoc,
	locale,
}: {
	appDoc: AppDoc;
	locale: Locale;
}) {
	const copy = siteCopy[locale];
	return (
		<div className="docs-actions">
			{appDoc.demo ? (
				<a href={appDoc.demo} target="_blank" rel="noreferrer">
					{copy.openDemo}
				</a>
			) : null}
			<a href={appDoc.github} target="_blank" rel="noreferrer">
				{copy.openGithub}
			</a>
		</div>
	);
}

function NotFoundPage({ locale }: { locale: Locale }) {
	const copy = siteCopy[locale];
	return (
		<Shell locale={locale}>
			<section className="docs-empty">
				<h1>{copy.notFound}</h1>
				<p>{copy.notFoundText}</p>
			</section>
		</Shell>
	);
}

const rootRoute = createRootRoute({
	component: Outlet,
	notFoundComponent: () => <NotFoundPage locale="pt-BR" />,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => <HomePage locale="pt-BR" />,
});

const localeRoutes = (["pt-br", "en"] as const).flatMap((localeSegment) => {
	const locale = localeFromRoute(localeSegment);
	const homeRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: localeSegment,
		component: () => <HomePage locale={locale} />,
	});
	const packageRoutes = packageDocs.map((packageDoc) =>
		createRoute({
			getParentRoute: () => rootRoute,
			path: `${localeSegment}/packages/${packageDoc.id}`,
			component: () => <PackagePage locale={locale} packageDoc={packageDoc} />,
		}),
	);
	const appRoutes = appDocs.map((appDoc) =>
		createRoute({
			getParentRoute: () => rootRoute,
			path: `${localeSegment}/apps/${appDoc.id}`,
			component: () => <AppPage locale={locale} appDoc={appDoc} />,
		}),
	);
	const conceptRoutes = packageConceptDocs.map((conceptDoc) =>
		createRoute({
			getParentRoute: () => rootRoute,
			path: `${localeSegment}/packages/${conceptDoc.packageId}/concepts/${conceptDoc.id}`,
			component: () => (
				<PackageConceptPage locale={locale} conceptDoc={conceptDoc} />
			),
		}),
	);
	const appConceptRoutes = appConceptDocs.map((conceptDoc) =>
		createRoute({
			getParentRoute: () => rootRoute,
			path: `${localeSegment}/apps/${conceptDoc.appId}/concepts/${conceptDoc.id}`,
			component: () => (
				<AppConceptPage locale={locale} conceptDoc={conceptDoc} />
			),
		}),
	);

	return [homeRoute, ...packageRoutes, ...appRoutes, ...conceptRoutes, ...appConceptRoutes];
});

const routeTree = rootRoute.addChildren([indexRoute, ...localeRoutes]);

const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	scrollRestoration: true,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default function App() {
	return <RouterProvider router={router} />;
}
