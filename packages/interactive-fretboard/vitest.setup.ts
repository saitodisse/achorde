import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

expect.extend(matchers);

if (typeof DOMPoint === "undefined") {
	class DOMPointPolyfill {
		x: number;
		y: number;
		z: number;
		w: number;

		constructor(x = 0, y = 0, z = 0, w = 1) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
		}

		matrixTransform(matrix: DOMMatrix): DOMPointPolyfill {
			const { x, y, z, w } = this;
			const nx = matrix.a * x + matrix.c * y + matrix.e * w;
			const ny = matrix.b * x + matrix.d * y + matrix.f * w;
			return new DOMPointPolyfill(nx, ny, z, w);
		}
	}

	// @ts-expect-error test polyfill
	globalThis.DOMPoint = DOMPointPolyfill;
}
