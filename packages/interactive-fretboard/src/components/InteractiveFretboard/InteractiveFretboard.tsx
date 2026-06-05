import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
	type PointerEvent as ReactPointerEvent,
} from "react";
import { parseFretNotationToVoicing, type FrettedInstrumentVoicing } from "@achorde/musical-domain";
import { applyChangePipeline, voicingToEditorState } from "../../adapters/applyChangePipeline.js";
import { buildHitAreas } from "../../interaction/buildHitAreas.js";
import { hitTestFretCell } from "../../interaction/hitTestFretCell.js";
import { screenToSvgPoint } from "../../interaction/screenToSvgPoint.js";
import { computeFretboardFrame } from "../../layout/computeFretboardFrame.js";
import { noteAtFret } from "../../utils/noteAtFret.js";
import {
	DEFAULT_GUITAR_TUNING,
	FRET_DOT_RADIUS,
	STANDARD_INLAY_FRETS,
	TUNING_LABEL_GAP,
	TUNING_NUT_INSET,
} from "./constants.js";
import type { InteractiveFretboardProps } from "./types.js";
import { useOpenNotesMap } from "./useOpenNotesMap.js";
import "./interactive-fretboard.css";

function resolveVoicing(props: InteractiveFretboardProps): FrettedInstrumentVoicing | null {
	if (props.valueMode === "fretNotation") {
		if (!props.fretNotation) {
			return null;
		}
		return (
			parseFretNotationToVoicing({
				fretNotation: props.fretNotation,
				chordSymbol: props.chordSymbol ?? "",
				id: "interactive-fretboard-draft",
			}) ?? null
		);
	}
	return props.value ?? null;
}

export const InteractiveFretboard = forwardRef<SVGSVGElement, InteractiveFretboardProps>(
	function InteractiveFretboard(props, ref) {
		const {
			valueMode = "voicing",
			onChange,
			orientation = "horizontal",
			handedness = "right",
			fretCount = 16,
			stringCount = 6,
			tuning = DEFAULT_GUITAR_TUNING,
			inferBarresOnChange = true,
			detectChord = true,
			showFretNumbers = true,
			showInlays = true,
			showDotText = true,
			showTuning = false,
			viewBoxWidth,
			viewBoxHeight,
			minHitSize = 44,
			className,
			style,
			disabled = false,
			"aria-label": ariaLabel = "Interactive fretboard",
		} = props;

		const svgRef = useRef<SVGSVGElement>(null);
		useImperativeHandle(ref, () => svgRef.current as SVGSVGElement);

		const voicingKey = useMemo(() => {
			if (valueMode === "fretNotation") {
				if (!props.fretNotation) {
					return "empty";
				}
				return `fretNotation:${props.fretNotation}:${props.chordSymbol ?? ""}`;
			}
			const value = props.value;
			if (!value) {
				return "empty";
			}
			const barreKey = (value.barres ?? [])
				.map((b) => `${b.fret}:${b.fromStringIndex}-${b.toStringIndex}`)
				.join("|");
			return `voicing:${value.strings.map((s) => `${s.stringIndex}${s.state}${s.fret ?? ""}`).join(",")};b=${barreKey}`;
		}, [valueMode, props.fretNotation, props.chordSymbol, props.value]);

		const baseVoicing = useMemo(() => resolveVoicing(props), [voicingKey]);

		const openNotesByString = useOpenNotesMap(tuning, stringCount);

		const syncedState = useMemo(() => {
			if (!baseVoicing) {
				return { cells: new Map() };
			}
			return voicingToEditorState(baseVoicing);
		}, [voicingKey, baseVoicing]);

		const [editorState, setEditorState] = useState(syncedState);

		useEffect(() => {
			setEditorState(syncedState);
		}, [voicingKey, syncedState]);

		const activeState = onChange ? editorState : syncedState;

		const frame = useMemo(
			() =>
				computeFretboardFrame({
					viewMode: { orientation, handedness },
					fretCount,
					stringCount,
					viewBoxWidth,
					viewBoxHeight,
					minHitSize,
					nutInset: showTuning ? TUNING_NUT_INSET : 0,
				}),
			[
				orientation,
				handedness,
				fretCount,
				stringCount,
				viewBoxWidth,
				viewBoxHeight,
				minHitSize,
				showTuning,
			],
		);

		const hitAreas = useMemo(() => buildHitAreas(frame), [frame]);
		const [hover, setHover] = useState<{ stringIndex: number; fret: number } | null>(null);

		const handlePointerDown = useCallback(
			(event: ReactPointerEvent<SVGSVGElement>) => {
				if (disabled || !onChange || !baseVoicing || !svgRef.current) {
					return;
				}

				event.preventDefault();
				const point = screenToSvgPoint(svgRef.current, event.nativeEvent);
				if (!point) {
					return;
				}

				const hit = hitTestFretCell(frame, point);
				if (!hit) {
					return;
				}

				const result = applyChangePipeline({
					state: activeState,
					baseVoicing,
					openNotesByString,
					target: hit,
					inferBarresOnChange,
					detectChord,
					includeFretNotation: valueMode === "fretNotation",
				});

				setEditorState(result.state);
				onChange(result.details);
			},
			[
				disabled,
				onChange,
				baseVoicing,
				frame,
				activeState,
				openNotesByString,
				inferBarresOnChange,
				detectChord,
				valueMode,
			],
		);

		const handlePointerMove = useCallback(
			(event: ReactPointerEvent<SVGSVGElement>) => {
				if (disabled || !svgRef.current) {
					return;
				}

				const point = screenToSvgPoint(svgRef.current, event.nativeEvent);
				if (!point) {
					setHover(null);
					return;
				}

				setHover(hitTestFretCell(frame, point));
			},
			[disabled, frame],
		);

		const isHorizontal = orientation === "horizontal";

		const inlays = useMemo(() => {
			if (!showInlays) {
				return [];
			}

			return STANDARD_INLAY_FRETS.filter((f) => f <= fretCount).flatMap((fret) => {
				const fretLine = frame.frets[fret];
				if (!fretLine) {
					return [];
				}

				const prev = frame.frets[fret - 1];
				const center = isHorizontal
					? {
							x: (prev?.x1 ?? frame.grid.x) + (fretLine.x1 - (prev?.x1 ?? frame.grid.x)) / 2,
							y: frame.grid.y + frame.grid.height / 2,
						}
					: {
							x: frame.grid.x + frame.grid.width / 2,
							y: (prev?.y1 ?? frame.grid.y) + (fretLine.y1 - (prev?.y1 ?? frame.grid.y)) / 2,
						};

				if (fret === 12) {
					const offset = isHorizontal ? frame.grid.height * 0.15 : frame.grid.width * 0.15;
					return isHorizontal
						? [
								{ ...center, y: center.y - offset },
								{ ...center, y: center.y + offset },
							]
						: [
								{ ...center, x: center.x - offset },
								{ ...center, x: center.x + offset },
							];
				}

				return [center];
			});
		}, [showInlays, fretCount, frame, isHorizontal]);

		const dots = useMemo(() => {
			const items: Array<{
				stringIndex: number;
				center: { x: number; y: number };
				state: "open" | "muted" | "fretted";
				label: string;
			}> = [];

			for (const cell of activeState.cells.values()) {
				const frameCell = frame.cells.find(
					(c) => c.stringIndex === cell.stringIndex && c.fret === cell.fret,
				);
				if (!frameCell) {
					continue;
				}

				const openNote =
					openNotesByString.get(cell.stringIndex) ??
					baseVoicing?.strings.find((s) => s.stringIndex === cell.stringIndex)?.openNote ??
					"E";

				let label = "";
				if (cell.state === "muted") {
					label = "×";
				} else if (cell.state === "open") {
					label = showDotText ? openNote.replace(/\d/g, "") : "○";
				} else {
					label = showDotText
						? noteAtFret(openNote, cell.fret).replace(/\d/g, "")
						: String(cell.fret);
				}

				items.push({
					stringIndex: cell.stringIndex,
					center: frameCell.center,
					state: cell.state === "fretted" ? "fretted" : cell.state,
					label,
				});
			}

			return items;
		}, [activeState, frame, openNotesByString, baseVoicing, showDotText]);

		const wrapperClass = ["ifret-root", disabled ? "ifret-root--disabled" : "", className]
			.filter(Boolean)
			.join(" ");

		return (
			<div className={wrapperClass} style={style}>
				<svg
					ref={svgRef}
					viewBox={`0 0 ${frame.viewBox.width} ${frame.viewBox.height}`}
					role="img"
					aria-label={ariaLabel}
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerLeave={() => setHover(null)}
				>
					<rect
						x={0}
						y={0}
						width={frame.viewBox.width}
						height={frame.viewBox.height}
						fill="var(--ifret-bg)"
					/>

					{frame.frets.map((fret) => (
						<line
							key={`fret-${fret.index}`}
							x1={fret.x1}
							y1={fret.y1}
							x2={fret.x2}
							y2={fret.y2}
							className={
								fret.index === 0 ? "ifret-grid-fret ifret-grid-fret--nut" : "ifret-grid-fret"
							}
							strokeWidth={fret.index === 0 ? 3 : fret.index % 12 === 0 ? 2 : 1}
						/>
					))}

					{frame.strings.map((string) => (
						<line
							key={`string-${string.stringIndex}`}
							x1={string.x1}
							y1={string.y1}
							x2={string.x2}
							y2={string.y2}
							className="ifret-grid-string"
							strokeWidth={1}
						/>
					))}

					{inlays.map((inlay, index) => (
						<circle
							key={`inlay-${index}`}
							cx={inlay.x}
							cy={inlay.y}
							r={6}
							className="ifret-inlay"
						/>
					))}

					{showFretNumbers &&
						frame.frets.slice(1).map((fret) => {
							const prev = frame.frets[fret.index - 1];
							const label = String(fret.index);
							const x = isHorizontal ? (prev.x1 + fret.x1) / 2 : frame.grid.x - 12;
							const y = isHorizontal ? frame.viewBox.height - 8 : (prev.y1 + fret.y1) / 2;
							return (
								<text
									key={`fret-label-${fret.index}`}
									x={x}
									y={y}
									className="ifret-fret-label"
									textAnchor="middle"
								>
									{label}
								</text>
							);
						})}

					{showTuning &&
						frame.strings.map((string) => {
							const openNote = openNotesByString.get(string.stringIndex) ?? "";
							const nutAlongFretAxis = isHorizontal
								? (frame.frets[0]?.x1 ?? frame.grid.x)
								: (frame.frets[0]?.y1 ?? frame.grid.y);
							const labelOffset = FRET_DOT_RADIUS + TUNING_LABEL_GAP;
							const x = isHorizontal ? nutAlongFretAxis - labelOffset : string.x1;
							const y = isHorizontal ? string.y1 : nutAlongFretAxis - labelOffset;
							return (
								<text
									key={`tuning-${string.stringIndex}`}
									x={x}
									y={y}
									className="ifret-tuning-label"
									textAnchor={isHorizontal ? "end" : "middle"}
									dominantBaseline={isHorizontal ? "middle" : "auto"}
								>
									{openNote.replace(/\d/g, "")}
								</text>
							);
						})}

					{hitAreas.map((area) => (
						<rect
							key={`hit-${area.stringIndex}-${area.fret}`}
							x={area.hitRect.x}
							y={area.hitRect.y}
							width={area.hitRect.width}
							height={area.hitRect.height}
							fill="transparent"
							className="ifret-hit-area"
							data-string-index={area.stringIndex}
							data-fret={area.fret}
							aria-hidden
						/>
					))}

					{dots.map((dot) => (
						<g
							key={`dot-${dot.stringIndex}`}
							transform={`translate(${dot.center.x}, ${dot.center.y})`}
						>
							{dot.state === "muted" ? (
								<>
									<circle r={FRET_DOT_RADIUS} className="ifret-dot ifret-dot--muted" />
									<text className="ifret-dot-label" textAnchor="middle" dominantBaseline="middle">
										×
									</text>
								</>
							) : (
								<>
									<circle r={FRET_DOT_RADIUS} className="ifret-dot" />
									<text className="ifret-dot-label" textAnchor="middle" dominantBaseline="middle">
										{dot.label}
									</text>
								</>
							)}
						</g>
					))}

					{hover &&
						(() => {
							const cell = frame.cells.find(
								(c) => c.stringIndex === hover.stringIndex && c.fret === hover.fret,
							);
							if (!cell) {
								return null;
							}
							return (
								<circle cx={cell.center.x} cy={cell.center.y} r={16} className="ifret-hover" />
							);
						})()}
				</svg>
			</div>
		);
	},
);
