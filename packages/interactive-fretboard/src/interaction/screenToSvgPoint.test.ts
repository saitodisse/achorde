import { describe, expect, it } from "vitest";
import { screenToSvgPoint } from "./screenToSvgPoint.js";

describe("screenToSvgPoint", () => {
	it("converts client coordinates through inverse CTM", () => {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		document.body.appendChild(svg);

		const inverse = {
			a: 0.5,
			b: 0,
			c: 0,
			d: 0.5,
			e: 10,
			f: 20,
			multiplySelf: function () {
				return this;
			},
			inverse: function () {
				return this;
			},
		} as unknown as DOMMatrix;

		svg.getScreenCTM = () =>
			({
				inverse: () => inverse,
			}) as DOMMatrix;

		Object.defineProperty(svg, "isConnected", { value: true, configurable: true });

		const point = screenToSvgPoint(svg, {
			clientX: 100,
			clientY: 200,
		} as PointerEvent);

		expect(point).not.toBeNull();
		expect(point?.x).toBe(60);
		expect(point?.y).toBe(120);

		document.body.removeChild(svg);
	});

	it("returns null when SVG is disconnected", () => {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		Object.defineProperty(svg, "isConnected", { value: false, configurable: true });
		expect(screenToSvgPoint(svg, { clientX: 0, clientY: 0 } as PointerEvent)).toBeNull();
	});

	it("returns null when CTM is unavailable", () => {
		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.getScreenCTM = () => null;
		Object.defineProperty(svg, "isConnected", { value: true, configurable: true });
		expect(screenToSvgPoint(svg, { clientX: 0, clientY: 0 } as PointerEvent)).toBeNull();
	});
});
