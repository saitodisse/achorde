/** Semantic pointer button for fretboard edits (mouse, pen, touch). */
export type InteractiveFretboardPointerButton = "primary" | "middle" | "secondary";

const BUTTON_BY_CODE: Record<number, InteractiveFretboardPointerButton> = {
	0: "primary",
	1: "middle",
	2: "secondary",
};

/**
 * Maps a pointer/mouse `button` code to a stable identifier for consumers.
 * Returns `null` for auxiliary buttons (back, forward, etc.).
 */
export function resolvePointerButton(
	event: Pick<PointerEvent | MouseEvent, "button">,
): InteractiveFretboardPointerButton | null {
	return BUTTON_BY_CODE[event.button] ?? null;
}
