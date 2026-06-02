import { Button, Card, CardContent, CardHeader, CardTitle } from "@repo/ui";

export default function Home() {
  return (
    <main className="graph-paper min-h-screen w-full flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl flex flex-col items-center gap-10 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Math Resources Hub
        </span>

        <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-tight text-foreground">
          Editorial-quality math,
          <br />
          one clean page at a time.
        </h1>

        <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
          A growing library of worked examples, references, and tools — set on
          warm paper, drawn on a familiar grid.
        </p>

        <Card className="w-full max-w-md text-left">
          <CardHeader>
            <CardTitle className="font-display text-2xl">
              Coming soon
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              The hub is under construction. This is a tracer page rendered in
              the resources brand and the shared <code>@repo/ui</code> kit.
            </p>
            <div className="flex gap-3">
              <Button>Explore resources</Button>
              <Button variant="outline">Learn more</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
