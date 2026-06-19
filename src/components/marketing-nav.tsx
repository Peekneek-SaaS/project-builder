import Link from "next/link";
import * as motion from "motion/react-client";
import { defaultTransition, fadeIn } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import Logo from "../../public/Logo/Logo";
import { Show } from "@clerk/nextjs";
import { HugeiconsIcon } from "@hugeicons/react";
import { DashboardSquare01Icon } from "@hugeicons/core-free-icons";

export function MarketingNav() {
  const links = [
    { label: "Product", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];
  return (
    <motion.header
      className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={defaultTransition}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Show
            fallback={
              <Button asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            }
            when="signed-in"
          >
            <Button asChild>
              <Link href="/dashboard" className="flex items-center gap-1">
                <HugeiconsIcon icon={DashboardSquare01Icon} />
                Dashboard
              </Link>
            </Button>
          </Show>
        </div>
      </div>
    </motion.header>
  );
}
