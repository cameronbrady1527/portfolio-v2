import { prepareBank } from "@/lib/regents/prepare";
import { SelfScore } from "@/components/SelfScore";

// Server boundary for the Regents bank: resolves the bank and pre-renders all
// math to HTML at build time (server-only KaTeX), then hands plain serializable
// items to the interactive client widget. This is what `<SelfScore bank="…">`
// resolves to in MDX, and it's why the browser ships no KaTeX.
export function SelfScoreSection({
  bank,
  className,
}: {
  bank: string;
  className?: string;
}) {
  return <SelfScore items={prepareBank(bank)} className={className} />;
}
