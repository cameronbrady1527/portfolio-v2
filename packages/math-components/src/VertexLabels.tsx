/**
 * Vertex labels for a polygon on the mafs plane — A, B, C… (or A′, B′, C′ for an
 * image). Shared by the Grapher, SequenceBuilder, and SymmetryExplorer so every
 * figure labels its vertices the way a geometry problem does. mafs <Text> is
 * pixel-sized and lives inside a <Mafs>, so this must be rendered as a child of
 * one. Pure-label helpers are exported for reuse/testing.
 */
import { Text } from "mafs";
import type { Pt } from "./logic";

export const PRIME = "′";

/** The letter for each vertex: the given label's chars if they fit, else A,B,C… */
export function vertexLetters(
  label: string | undefined,
  n: number,
  prime: boolean,
): string[] {
  const base =
    label && label.length === n
      ? label.split("")
      : Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i));
  return base.map((c) => (prime ? `${c}${PRIME}` : c));
}

export function centroidOf(vertices: readonly Pt[]): Pt {
  return {
    x: vertices.reduce((s, v) => s + v.x, 0) / vertices.length,
    y: vertices.reduce((s, v) => s + v.y, 0) / vertices.length,
  };
}

/**
 * Render a letter just outside each vertex, along the centroid→vertex ray. Image
 * labels (`prime`) sit a touch further out so A and A′ never coincide when the
 * image overlaps the preimage.
 */
export function VertexLabels({
  vertices,
  label,
  prime = false,
  color,
}: {
  vertices: readonly Pt[];
  label?: string;
  prime?: boolean;
  color: string;
}) {
  const c = centroidOf(vertices);
  const letters = vertexLetters(label, vertices.length, prime);
  const off = prime ? 0.62 : 0.45;
  return (
    <>
      {vertices.map((v, i) => {
        const dx = v.x - c.x;
        const dy = v.y - c.y;
        const len = Math.hypot(dx, dy) || 1;
        return (
          <Text
            key={`vl-${i}`}
            x={v.x + (dx / len) * off}
            y={v.y + (dy / len) * off}
            size={18}
            color={color}
          >
            {letters[i]}
          </Text>
        );
      })}
    </>
  );
}
