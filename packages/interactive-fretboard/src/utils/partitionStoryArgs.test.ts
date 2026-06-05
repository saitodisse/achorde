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
});
