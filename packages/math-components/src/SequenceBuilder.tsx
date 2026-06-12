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

  const moveUp = (i: number) =>
    edit((prev) => {
      if (i === 0) return prev;
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });

  return (
    <div className={["cbmc-sequence-builder", className].filter(Boolean).join(" ")}>
      <p style={{ fontWeight: 500 }}>
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
          {tested?.final ? (
            <ShapeOutline shape={tested.final} color={IMAGE_COLOR} dashed />
          ) : null}
        </Mafs>
      </div>

      <div role="group" aria-label="Available moves" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
        {palette.map((m) => (
          <button
            key={m.id}
            type="button"
            disabled={moves.length >= maxSteps}
            onClick={() => edit((prev) => [...prev, m])}
          >
            Add: {m.label}
          </button>
        ))}
      </div>

      <ol aria-label="Your sequence" style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.5rem" }}>
        {moves.map((m, i) => (
          <li key={`${m.id}-${i}`} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>
              {i + 1}. {m.label}
            </span>
            <button type="button" aria-label={`Move up: step ${i + 1}`} onClick={() => moveUp(i)}>
              ↑
            </button>
            <button
              type="button"
              aria-label={`Remove: step ${i + 1}`}
              onClick={() => edit((prev) => prev.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </li>
        ))}
      </ol>

      <button
        type="button"
        disabled={moves.length === 0}
        onClick={test}
        style={{ marginTop: "0.5rem" }}
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
