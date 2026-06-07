import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InteractiveFretboard } from "./InteractiveFretboard.js";

describe("InteractiveFretboard", () => {
	it("renders fretNotation mode without re-render loop", () => {
		render(<InteractiveFretboard valueMode="fretNotation" fretNotation="x32010" chordSymbol="C" />);

		expect(screen.getByRole("img", { name: "Interactive fretboard" })).toBeInTheDocument();
	});

	it("applies appearance props to wrapper theme variables and dot geometry", () => {
		const { container } = render(
			<InteractiveFretboard
				valueMode="fretNotation"
				fretNotation="320003"
				chordSymbol="G"
				dotRadius={30}
				inlayRadius={9}
				nutStrokeWidth={5}
				dotLabelFontSize={22}
				colors={{ dot: "#ff0000", background: "#101010" }}
			/>,
		);

		const wrapper = container.querySelector(".ifret-root") as HTMLElement | null;
		expect(wrapper).not.toBeNull();
		expect(wrapper?.style.getPropertyValue("--ifret-dot-fill")).toBe("#ff0000");
		expect(wrapper?.style.getPropertyValue("--ifret-bg")).toBe("#101010");
		expect(wrapper?.style.getPropertyValue("--ifret-dot-label-size")).toBe("22px");

		const frettedDot = container.querySelector("circle.ifret-dot:not(.ifret-dot--muted)");
		expect(frettedDot).toHaveAttribute("r", "30");

		const inlay = container.querySelector("circle.ifret-inlay");
		expect(inlay).toHaveAttribute("r", "9");

		const nutLine = container.querySelector("line.ifret-grid-fret--nut");
		expect(nutLine).toHaveAttribute("stroke-width", "5");
	});

	it("accepts nested appearance group", () => {
		const { container } = render(
			<InteractiveFretboard
				valueMode="fretNotation"
				fretNotation="320003"
				appearance={{
					dotRadius: 18,
					colors: { dotMuted: "#abcdef" },
				}}
			/>,
		);

		const wrapper = container.querySelector(".ifret-root") as HTMLElement | null;
		expect(wrapper?.style.getPropertyValue("--ifret-dot-muted")).toBe("#abcdef");

		const frettedDot = container.querySelector("circle.ifret-dot:not(.ifret-dot--muted)");
		expect(frettedDot).toHaveAttribute("r", "18");
	});
});
