import { describe, expect, it } from "vitest";
import { resolvePointerButton } from "./resolvePointerButton.js";

describe("resolvePointerButton", () => {
	it("maps primary, middle, and secondary mouse buttons", () => {
		expect(resolvePointerButton({ button: 0 })).toBe("primary");
		expect(resolvePointerButton({ button: 1 })).toBe("middle");
		expect(resolvePointerButton({ button: 2 })).toBe("secondary");
	});

	it("ignores auxiliary buttons", () => {
		expect(resolvePointerButton({ button: 3 })).toBeNull();
		expect(resolvePointerButton({ button: 4 })).toBeNull();
	});
});
