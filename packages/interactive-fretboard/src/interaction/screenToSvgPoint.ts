export function screenToSvgPoint(
	svg: SVGSVGElement,
	event: PointerEvent | MouseEvent,
): { x: number; y: number } | null {
	if (!svg.isConnected) {
		return null;
	}

	const ctm = svg.getScreenCTM();
	if (!ctm) {
		return null;
	}

	const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse());
	return { x: point.x, y: point.y };
}
