import { describe, expect, it } from "vitest";
import { fretboardDefaultArgs } from "../stories/fretboardStoryHelpers.js";
import { partitionStoryArgs } from "./partitionStoryArgs.js";

describe("partitionStoryArgs", () => {
	it("keeps orientation and handedness out of boardProps for explicit forwarding", () => {
		const { orientation, handedness, boardProps } = partitionStoryArgs({
			...fretboardDefaultArgs,
			orientation: "vertical",
			handedness: "left",
		});

		expect(orientation).toBe("vertical");
		expect(handedness).toBe("left");
		expect(boardProps).not.toHaveProperty("orientation");
		expect(boardProps).not.toHaveProperty("handedness");
	});

	it("forwards appearance props through boardProps for InteractiveFretboard", () => {
		const { boardProps } = partitionStoryArgs({
			...fretboardDefaultArgs,
			dotRadius: 28,
			dotHoverPadding: 4,
			dotLabelFontSize: 19,
			fretLabelFontSize: 12,
			tuningLabelFontSize: 11,
			inlayRadius: 7,
			tuningLabelGap: 11,
			nutStrokeWidth: 4,
			colors: { dot: "#aabbcc", background: "#010203" },
		});

		expect(boardProps).toMatchObject({
			dotRadius: 28,
			dotHoverPadding: 4,
			dotLabelFontSize: 19,
			fretLabelFontSize: 12,
			tuningLabelFontSize: 11,
			inlayRadius: 7,
			tuningLabelGap: 11,
			nutStrokeWidth: 4,
			colors: { dot: "#aabbcc", background: "#010203" },
		});
	});
});
