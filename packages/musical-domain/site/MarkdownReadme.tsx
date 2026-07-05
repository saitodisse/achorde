import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import { MarkdownHooks } from "react-markdown";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { createHighlighterCore } from "shiki/core";

const markdownRemarkPlugins = [remarkGfm];
const markdownRehypePlugins = [
	[
		rehypePrettyCode,
		{
			getHighlighter: () =>
				createHighlighterCore({
					engine: createJavaScriptRegexEngine(),
					langs: [
						import("@shikijs/langs/bash"),
						import("@shikijs/langs/json"),
						import("@shikijs/langs/markdown"),
						import("@shikijs/langs/shellsession"),
						import("@shikijs/langs/tsx"),
						import("@shikijs/langs/typescript"),
					],
					themes: [import("@shikijs/themes/github-dark")],
				}),
			defaultLang: {
				block: "text",
				inline: "text",
			},
			keepBackground: false,
			theme: "github-dark",
		},
	],
];

export function MarkdownReadme({
	children,
	fallback,
}: {
	children: string;
	fallback: string;
}) {
	return (
		<MarkdownHooks
			fallback={<p className="docs-readme-loading">{fallback}</p>}
			remarkPlugins={markdownRemarkPlugins}
			rehypePlugins={markdownRehypePlugins}
		>
			{children}
		</MarkdownHooks>
	);
}
