import { useMemo } from "react";

/**
 * Builds stringIndex → open note map (1 = low E … 6 = high E).
 * `tuning` prop is ordered low string first (same as DEFAULT_GUITAR_TUNING).
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
