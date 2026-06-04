import { useMemo } from "react";

/**
 * Builds stringIndex → open note map (1 = high E … 6 = low E).
 * `tuning` prop is ordered high string first (same as DEFAULT_GUITAR_TUNING).
 */
export function useOpenNotesMap(tuning: string[], stringCount: number): Map<number, string> {
	return useMemo(() => {
		const map = new Map<number, string>();
		for (let visual = 0; visual < stringCount; visual += 1) {
			const stringIndex = visual + 1;
			map.set(stringIndex, tuning[visual] ?? "E");
		}
		return map;
	}, [tuning, stringCount]);
}
