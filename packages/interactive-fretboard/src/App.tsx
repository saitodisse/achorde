import { useMemo, useState } from "react";
import { parseFretNotationToVoicing } from "@achorde/musical-domain";
import { InteractiveFretboard } from "./components/InteractiveFretboard/InteractiveFretboard.js";
import { DEMO_URL, LIB_NAME, LIB_VERSION, NPM_URL, STORYBOOK_URL } from "./site-meta.js";
import "./components/InteractiveFretboard/interactive-fretboard.css";
import "./index.css";

const DEFAULT_FRET_NOTATION = "x32010";

export default function App() {
	const [fretNotation, setFretNotation] = useState(DEFAULT_FRET_NOTATION);
	const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
	const [handedness, setHandedness] = useState<"right" | "left">("right");
	const [showTuning, setShowTuning] = useState(false);
	const [detectChord, setDetectChord] = useState(true);
	const [inferBarresOnChange, setInferBarresOnChange] = useState(true);
	const [status, setStatus] = useState<string>("Ready");

	const voicing = useMemo(
		() =>
			parseFretNotationToVoicing({
				fretNotation,
				chordSymbol: "C",
				id: "interactive-fretboard-demo",
			}),
		[fretNotation],
	);

	return (
		<div className="ifret-demo">
			<header className="ifret-hero">
				<div>
					<p className="ifret-kicker">{LIB_NAME}</p>
					<h1>Pointer-first fretboard editor</h1>
					<p className="ifret-summary">
						Interactive, accessible fretboard editing with shared voicing contracts and a
						separate Storybook for controls and states.
					</p>
				</div>

				<div className="ifret-actions">
					<a href={STORYBOOK_URL} target="_blank" rel="noreferrer">
						Storybook
					</a>
					<a href={NPM_URL} target="_blank" rel="noreferrer">
						npm package
					</a>
				</div>
			</header>

			<main className="ifret-layout">
				<section className="ifret-panel ifret-preview">
					<div className="ifret-panel-head">
						<h2>Live demo</h2>
						<span>{status}</span>
					</div>

					<div className="ifret-preview-frame">
						{voicing ? (
							<InteractiveFretboard
								value={voicing}
								orientation={orientation}
								handedness={handedness}
								showTuning={showTuning}
								detectChord={detectChord}
								inferBarresOnChange={inferBarresOnChange}
								onChange={(details) => {
									setStatus(
										`${details.pointerButton} • ${details.voicing.chordSymbol ?? "unknown"} • ${details.voicing.strings
											.map((s) => `${s.stringIndex}:${s.state}${s.fret ?? ""}`)
											.join(" ")}`,
									);
								}}
							/>
						) : (
							<p>Invalid fret notation.</p>
						)}
					</div>
				</section>

				<aside className="ifret-panel ifret-controls">
					<div className="ifret-panel-head">
						<h2>Controls</h2>
						<a href={DEMO_URL} target="_blank" rel="noreferrer">
							Public demo
						</a>
					</div>

					<label>
						Fret notation
						<input value={fretNotation} onChange={(event) => setFretNotation(event.target.value)} />
					</label>

					<div className="ifret-row">
						<label>
							Orientation
							<select value={orientation} onChange={(event) => setOrientation(event.target.value as typeof orientation)}>
								<option value="horizontal">Horizontal</option>
								<option value="vertical">Vertical</option>
							</select>
						</label>

						<label>
							Handedness
							<select value={handedness} onChange={(event) => setHandedness(event.target.value as typeof handedness)}>
								<option value="right">Right</option>
								<option value="left">Left</option>
							</select>
						</label>
					</div>

					<label className="ifret-check">
						<input type="checkbox" checked={showTuning} onChange={(event) => setShowTuning(event.target.checked)} />
						Show tuning labels
					</label>

					<label className="ifret-check">
						<input type="checkbox" checked={detectChord} onChange={(event) => setDetectChord(event.target.checked)} />
						Detect chord on change
					</label>

					<label className="ifret-check">
						<input
							type="checkbox"
							checked={inferBarresOnChange}
							onChange={(event) => setInferBarresOnChange(event.target.checked)}
						/>
						Infer barres on change
					</label>

					<p className="ifret-footnote">
						Build: <code>pnpm build:app</code> | Storybook: <code>pnpm build-storybook</code> | v
						{LIB_VERSION}
					</p>
				</aside>
			</main>
		</div>
	);
}
