"use client";

/**
 * <SymmetryExplorer> — propose a rotation or a reflection axis and find out,
 * machine-checked, whether it carries the polygon onto itself (GEO-G.CO.3,
 * regular and irregular polygons alike).
 *
 * Every verdict and the "found X of N" denominator come from the pure
 * symmetry module — the UI never eyeballs geometry. Zero-stakes: nothing is
 * recorded anywhere.
 */
import { useMemo, useState } from "react";
import { Coordinates, Mafs, Polygon, Line } from "mafs";
import "mafs/core.css";
import { autoBounds } from "./grapherLogic";
import {
  allSymmetries,
  applyProposal,
  checkSymmetry,
  vertexCentroid,
  type PolygonShape,
  type SymmetryProposal,
} from "./logic";

const PREIMAGE_COLOR = "var(--cbmc-preimage-color, #16231c)";
const IMAGE_COLOR = "var(--cbmc-image-color, #1f8a5b)";
const MISS_COLOR = "var(--cbmc-target-color, #b4540a)";

export interface SymmetryExplorerProps {
  polygon: PolygonShape;
  className?: string;
}

const fmt = (a: number) => String(Math.round(a * 10) / 10);

function proposalKey(p: SymmetryProposal): string {
  return `${p.kind}:${Math.round(p.angleDeg * 1e4) / 1e4}`;
}

function describeProposal(p: SymmetryProposal): string {
  return p.kind === "rotation"
    ? `Rotating ${fmt(p.angleDeg)}° about the center`
    : `Reflecting across the ${fmt(p.angleDeg)}° axis`;
}

export function SymmetryExplorer({ polygon, className }: SymmetryExplorerProps) {
  const truth = useMemo(() => allSymmetries(polygon), [polygon]);
  const total = truth.rotations.length + truth.reflections.length;

  // Proposal menu: every candidate angle, symmetric or not — the misses teach.
  const proposals = useMemo<SymmetryProposal[]>(() => {
    const n = polygon.vertices.length;
    const c = vertexCentroid(polygon);
    const rotations: SymmetryProposal[] = Array.from({ length: n - 1 }, (_, i) => ({
      kind: "rotation",
      angleDeg: (360 * (i + 1)) / n,
    }));
    const axisAngles: number[] = [];
    const add = (x: number, y: number) => {
      if (Math.hypot(x - c.x, y - c.y) <= 1e-6) return;
      const a = (((Math.atan2(y - c.y, x - c.x) * 180) / Math.PI % 180) + 180) % 180;
      if (!axisAngles.some((b) => Math.abs(b - a) <= 1e-7)) axisAngles.push(a);
    };
    polygon.vertices.forEach((v) => add(v.x, v.y));
    polygon.vertices.forEach((v, i) => {
      const w = polygon.vertices[(i + 1) % n];
      add((v.x + w.x) / 2, (v.y + w.y) / 2);
    });
    const reflections: SymmetryProposal[] = axisAngles
      .sort((a, b) => a - b)
      .map((angleDeg) => ({ kind: "reflection", angleDeg }));
    return [...rotations, ...reflections];
  }, [polygon]);

  const [found, setFound] = useState<Set<string>>(() => new Set());
  const [last, setLast] = useState<null | {
    proposal: SymmetryProposal;
    isSymmetry: boolean;
  }>(null);

  const bounds = useMemo(() => autoBounds([polygon]), [polygon]);
  const centroid = useMemo(() => vertexCentroid(polygon), [polygon]);

  const propose = (proposal: SymmetryProposal) => {
    const isSymmetry = checkSymmetry(polygon, proposal);
    setLast({ proposal, isSymmetry });
    if (isSymmetry) {
      setFound((prev) => new Set(prev).add(proposalKey(proposal)));
    }
  };

  const foundCount = found.size;
  const movedVertices = last ? applyProposal(polygon, last.proposal) : null;

  return (
    <div className={["cbmc-symmetry-explorer", className].filter(Boolean).join(" ")}>
      <div className="cbmc-graph-paper" style={{ borderRadius: "var(--cbmc-radius, 0.5rem)" }}>
        <Mafs viewBox={{ x: bounds.x, y: bounds.y }} preserveAspectRatio="contain" pan={false} zoom={false}>
          <Coordinates.Cartesian
            xAxis={{ lines: 1, labels: () => "" }}
            yAxis={{ lines: 1, labels: () => "" }}
          />
          {last?.proposal.kind === "reflection" ? (
            <Line.PointAngle
              point={[centroid.x, centroid.y]}
              angle={(last.proposal.angleDeg * Math.PI) / 180}
              color={PREIMAGE_COLOR}
              style="dashed"
            />
          ) : null}
          <Polygon
            points={polygon.vertices.map((v) => [v.x, v.y] as [number, number])}
            color={PREIMAGE_COLOR}
          />
          {movedVertices ? (
            <Polygon
              points={movedVertices.map((v) => [v.x, v.y] as [number, number])}
              color={last?.isSymmetry ? IMAGE_COLOR : MISS_COLOR}
              strokeStyle="dashed"
            />
          ) : null}
        </Mafs>
      </div>

      <div
        role="group"
        aria-label="Symmetry proposals"
        style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}
      >
        {proposals.map((p) => (
          <button key={proposalKey(p)} type="button" onClick={() => propose(p)}>
            {p.kind === "rotation"
              ? `Rotate ${fmt(p.angleDeg)}°`
              : `Reflect across the ${fmt(p.angleDeg)}° axis`}
          </button>
        ))}
      </div>

      <div role="status" style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
        {last && (
          <p>
            {last.isSymmetry
              ? `Yes — ${describeProposal(last.proposal).toLowerCase()} carries the shape onto itself! `
              : `Not a symmetry — ${describeProposal(last.proposal).toLowerCase()} lands the shape somewhere new. `}
            {total === 0
              ? "This shape has no symmetries at all besides leaving it alone."
              : foundCount >= total
                ? `Found ${foundCount} of ${total} — that's all of them!`
                : `Found ${foundCount} of ${total} symmetries.`}
          </p>
        )}
      </div>
    </div>
  );
}
