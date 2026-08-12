import type { PackageId } from "./docs-content.js";

import interactiveFretboardReadme from "../../interactive-fretboard/README.md?raw";
import catalogPortalReadme from "../../catalog-portal/README.md?raw";
import contributionProtocolReadme from "../../contribution-protocol/README.md?raw";
import musicalDomainReadme from "../README.md?raw";
import sourceCatalogReadme from "../../source-catalog/README.md?raw";
import storybookConfigReadme from "../../storybook-config/README.md?raw";
import svguitarReactReadme from "../../svguitar-react/README.md?raw";
import tabEditorReadme from "../../tab-editor/README.md?raw";
import tabRendererReadme from "../../tab-renderer/README.md?raw";

export const packageReadmes = {
	"catalog-portal": catalogPortalReadme,
	"contribution-protocol": contributionProtocolReadme,
	"interactive-fretboard": interactiveFretboardReadme,
	"musical-domain": musicalDomainReadme,
	"source-catalog": sourceCatalogReadme,
	"storybook-config": storybookConfigReadme,
	"svguitar-react": svguitarReactReadme,
	"tab-editor": tabEditorReadme,
	"tab-renderer": tabRendererReadme,
} as const satisfies Record<PackageId, string>;
