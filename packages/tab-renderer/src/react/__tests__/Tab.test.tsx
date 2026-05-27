import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tab } from "../Tab";
import { tuaFlorBody } from "../../test/stubs/tua-flor";

describe("Tab", () => {
	it("renders the tua flor body through the public React adapter", () => {
		render(<Tab body={tuaFlorBody} />);

		expect(screen.getAllByText("Em7").length).toBeGreaterThan(0);
	});
});
