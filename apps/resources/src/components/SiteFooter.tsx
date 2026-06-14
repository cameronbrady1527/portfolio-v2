import Link from "next/link";

// Persistent global footer on every hub page: a second route back to the hub
// home and out to the main site, plus a copyright line. Replaces the ad-hoc
// one-line footer that used to live inside the topic page shell.
export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground sm:flex-row">
        <span>© 2026 Cameron Brady</span>
        <nav aria-label="Site" className="flex items-center gap-4">
          <Link href="/" className="transition-colors hover:text-primary">
            Hub home
          </Link>
          <Link href="/glossary" className="transition-colors hover:text-primary">
            Glossary
          </Link>
          <a
            href="https://cameronbrady.dev"
            className="transition-colors hover:text-primary"
          >
            cameronbrady.dev
          </a>
        </nav>
      </div>
    </footer>
  );
}
