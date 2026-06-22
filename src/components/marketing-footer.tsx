import Link from "next/link";
import * as motion from "motion/react-client";
import { defaultTransition, fadeInUp, viewportOnce } from "@/lib/motion";
import Logo from "../../public/Logo/Logo";

export function MarketingFooter() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "Product", href: "#features" },
        { label: "How it works", href: "#how" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Social",
      links: [
        { label: "LinkedIn", href: "#" },
        { label: "X", href: "#" },
        { label: "Reddit", href: "#" },
        { label: "Instagram", href: "#" },
      ],
    },
    // {
    //   title: "Company",
    //   links: ["About", "Blog", "Careers", "Contact"],
    // },
    // {
    //   title: "Resources",
    //   links: ["Help center", "Guides", "API", "Status"],
    // },
    // {
    //   title: "Legal",
    //   links: ["Privacy", "Terms", "Security", "Cookies"],
    // },
  ];
  return (
    <motion.footer
      className="border-t border-border"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeInUp}
      transition={defaultTransition}
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex gap-10 flex-col md:flex-row justify-between">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Turn your resume into a beautiful, shareable business card in
              seconds.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-sm font-medium">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>© 2026 Cardably, Inc. All rights reserved.</p>
          <p>Made for people who network.</p>
        </div>
      </div>
    </motion.footer>
  );
}
