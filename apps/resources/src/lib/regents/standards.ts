// Plain-English label for each NYSED standard code used in the banks. Students
// see the friendly label; the raw code stays available in a tooltip (and the
// per-item "Exam info" line) — code-secondary UX. Fallback: the code itself.
//
// Keep in sync with the banks: standards.test.ts asserts every standard used by
// any item has an entry here, so a new standard fails the build LOUD rather than
// silently showing a bare code.

export const STANDARD_LABELS: Record<string, string> = {
  "AI-A.REI.1": "Reasoning with equations",
  "AI-A.REI.3": "Solving linear equations & inequalities",
  "AI-A.REI.4": "Solving quadratics",
  "AI-A.REI.6": "Systems of equations",
  "AI-A.REI.7": "Linear–quadratic systems",
  "AI-A.REI.12": "Graphing inequalities",
  "AI-A.APR.1": "Polynomial operations",
  "AI-A.SSE.2": "Factoring",
  "AI-A.SSE.3": "Equivalent expressions",
  "AI-A.CED.1": "Creating equations",
  "AI-A.CED.2": "Graphing linear equations",
  "AI-A.CED.4": "Literal equations",
  "AI-F.IF.1": "Defining functions",
  "AI-F.IF.2": "Function notation",
  "AI-F.IF.3": "Sequences",
  "AI-F.IF.4": "Interpreting graphs",
  "AI-F.IF.5": "Domain in context",
  "AI-F.IF.6": "Rate of change",
  "AI-F.IF.8": "Vertex form & max/min",
  "AI-F.IF.9": "Comparing functions",
  "AI-F.BF.2": "Building sequences",
  "AI-F.BF.3": "Transforming functions",
  "AI-A.APR.3": "Zeros of a quadratic",
  "AI-F.LE.1": "Linear vs. exponential",
  "AI-F.LE.2": "Building functions",
  "AI-F.LE.5": "Exponential models",
  "AI-S.ID.2": "Comparing data sets",
  "AI-S.ID.3": "Spread & outliers",
  "AI-S.ID.5": "Two-way frequency tables",
  "AI-S.ID.6": "Linear regression",
  "AI-S.ID.7": "Slope & intercept in context",
  "AI-S.ID.8": "Correlation coefficient",
  "AI-S.ID.9": "Correlation vs. causation",
  "AI-N.RN.3": "Rational & irrational numbers",
};

/** Friendly label for a standard code, or the code itself if unmapped. */
export function standardLabel(code: string): string {
  return STANDARD_LABELS[code] ?? code;
}
