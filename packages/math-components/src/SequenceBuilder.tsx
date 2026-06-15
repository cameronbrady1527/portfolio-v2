"use client";

/**
 * <SequenceBuilder> — the inverse puzzle for sequences of transformations
 * (GEO-G.CO.5): given a preimage and a target, the student assembles a
 * sequence from a palette of moves and tests it. The pure geometry is the
 * judge (applySequence + shapesCoincide) — never a visual eyeball.
 *
 * Zero-stakes: solved/unsolved feedback only, retry always possible, nothing
 * recorded anywhere.
 */
import { useMemo, useState } from "react";
import { Coordinates, Mafs, Polygon, Point } from "mafs";
import "mafs/core.css";
import type { Shape } from "./logic";
import { applySequence, shapesCoincide, type TransformStep } from "./logic";
import { autoBounds } from "./grapherLogic";
import { VertexLabels } from "./VertexLabels";

const PREIMAGE_COLOR = "var(--cbmc-preimage-color, #16231c)";
const IMAGE_COLOR = "var(--cbmc-image-color, #1f8a5b)";
const TARGET_COLOR = "var(--cbmc-target-color, #b4540a)";

export interface PaletteMove {
  id: string;
  label: string;
  step: TransformStep;
}

export interface SequencePuzzle {
  preimage: Shape;
  target: Shape;
  palette: PaletteMove[];
  /** Maximum sequence length; default 3. */
  maxSteps?: number;
}

export interface SequenceBuilderProps {
  puzzle: SequencePuzzle;
  prompt?: string;
  className?: string;
}

function ShapeOutline({ shape, color, dashed }: { shape: Shape; color: string; dashed?: boolean }) {
  if (shape.type === "point") {
    return <Point x={shape.at.x} y={shape.at.y} color={color} />;
  }
  const points: [number, number][] =
    shape.type === "segment"
      ? [
          [shape.from.x, shape.from.y],
          [shape.to.x, shape.to.y],
        ]
      : shape.vertices.map((v) => [v.x, v.y] as [number, number]);
  return (
    <Polygon
      points={points}
      color={color}
      strokeStyle={dashed ? "dashed" : "solid"}
    />
  );
}

export function SequenceBuilder({ puzzle, prompt, className }: SequenceBuilderProps) {
  const { preimage, target, palette } = puzzle;
  const maxSteps = puzzle.maxSteps ?? 3;

  const [moves, setMoves] = useState<PaletteMove[]>([]);
  const [tested, setTested] = useState<null | { solved: boolean; final: Shape | null }>(null);

  const bounds = useMemo(
    () => autoBounds([preimage, target]),
    [preimage, target],
  );

  const test = () => {
    const trail = applySequence(preimage, moves.map((m) => m.step));
    const final = trail.at(-1) ?? preimage;
    setTested({ solved: shapesCoincide(final, target), final });
  };

  const edit = (fn: (prev: PaletteMove[]) => PaletteMove[]) => {
    setMoves(fn);
    setTested(null); // editing invalidates the last verdict
  };

  const swap = (i: number, j: number) =>
    edit((prev) => {
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const moveUp = (i: number) => swap(i, i - 1);
  const moveDown = (i: number) => swap(i, i + 1);

  const full = moves.length >= maxSteps;

  return (
    <div className={["cbmc-sequence-builder", className].filter(Boolean).join(" ")}>
      <p className="cbmc-instruction">
        {prompt ?? "Build a sequence that carries the figure onto the target."}
      </p>

      <div className="cbmc-graph-paper" style={{ borderRadius: "var(--cbmc-radius, 0.5rem)" }}>
        <Mafs viewBox={{ x: bounds.x, y: bounds.y }} preserveAspectRatio="contain" pan={false} zoom={false}>
          <Coordinates.Cartesian
            xAxis={{ lines: 1, labels: () => "" }}
            yAxis={{ lines: 1, labels: () => "" }}
          />
          <ShapeOutline shape={target} color={TARGET_COLOR} dashed />
          <ShapeOutline shape={preimage} color={PREIMAGE_COLOR} />
          {preimage.type === "polygon" ? (
            <VertexLabels
              vertices={preimage.vertices}
              label={preimage.label}
              color={PREIMAGE_COLOR}
            />
          ) : null}
          {tested?.final ? (
            <ShapeOutline shape={tested.final} color={IMAGE_COLOR} dashed />
          ) : null}
          {tested?.final?.type === "polygon" ? (
            <VertexLabels
              vertices={tested.final.vertices}
              label={tested.final.label}
              prime
              color={IMAGE_COLOR}
            />
          ) : null}
        </Mafs>
      </div>

      <p className="cbmc-group-label">Tap a move to add it to your sequence</p>
      <div className="cbmc-controls" role="group" aria-label="Available moves">
        {palette.map((m) => (
          <button
            key={m.id}
            type="button"
            className="cbmc-chip cbmc-chip-add"
            aria-label={`Add: ${m.label}`}
            disabled={full}
            onClick={() => edit((prev) => [...prev, m])}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="cbmc-build">
        <p className="cbmc-build-head">
          Your sequence ({moves.length} of {maxSteps})
        </p>
        {moves.length === 0 ? (
          <p className="cbmc-build-empty">
            Tap a move above to begin building your sequence →
          </p>
        ) : (
          <ol className="cbmc-step-list" aria-label="Your sequence">
            {moves.map((m, i) => (
              <li key={`${m.id}-${i}`} className="cbmc-step">
                <span className="cbmc-step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="cbmc-step-label">{m.label}</span>
                <button
                  type="button"
                  className="cbmc-icon-btn"
                  aria-label={`Move up: step ${i + 1}`}
                  disabled={i === 0}
                  onClick={() => moveUp(i)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="cbmc-icon-btn"
                  aria-label={`Move down: step ${i + 1}`}
                  disabled={i === moves.length - 1}
                  onClick={() => moveDown(i)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="cbmc-icon-btn"
                  aria-label={`Remove: step ${i + 1}`}
                  onClick={() => edit((prev) => prev.filter((_, j) => j !== i))}
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      <button
        type="button"
        className="cbmc-btn cbmc-btn-primary"
        disabled={moves.length === 0}
        onClick={test}
        style={{ marginTop: "0.75rem" }}
      >
        Test my sequence
      </button>

      <div role="status" style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
        {tested &&
          (tested.solved ? (
            <p>Solved! Your sequence carries the figure exactly onto the target.</p>
          ) : (
            <p>
              Not yet — the figure lands somewhere else (shown dashed). Adjust
              your moves or their order and test again.
            </p>
          ))}
      </div>
    </div>
  );
}
