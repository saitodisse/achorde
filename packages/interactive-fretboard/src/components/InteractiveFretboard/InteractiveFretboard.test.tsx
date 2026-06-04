import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InteractiveFretboard } from "./InteractiveFretboard.js";

describe("InteractiveFretboard", () => {
	it("renders fretNotation mode without re-render loop", () => {
		render(
			<InteractiveFretboard valueMode="fretNotation" fretNotation="x32010" chordSymbol="C" />,
		);

		expect(screen.getByRole("img", { name: "Interactive fretboard" })).toBeInTheDocument();
	});
});
