import Link from "next/link";

import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCardIcon } from "@hugeicons/core-free-icons";

export function EmbedBranding() {
  return (
    <Link
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground shadow-sm transition-colors hover:text-foreground"
    >
      <HugeiconsIcon icon={CreditCardIcon} size={14} />
      <span>
        Powered by <span className="font-medium text-foreground">Cardably</span>
      </span>
    </Link>
  );
}
