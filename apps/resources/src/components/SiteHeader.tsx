import Link from "next/link";

// Persistent global header on every hub page. Wordmark links to the hub home;
// a same-tab link reaches the main site. Kept intentionally minimal — a subject
// switcher can be added here later without restructuring.
export function SiteHeader() {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-primary transition-colors hover:text-foreground"
        >
          Math Resources Hub
        </Link>
        <a
          href="https://cameronbrady.dev"
          className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary"
        >
          ← cameronbrady.dev
        </a>
      </div>
    </header>
  );
}
