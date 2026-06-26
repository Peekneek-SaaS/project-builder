import Link from "next/link";
import * as motion from "motion/react-client";
import { defaultTransition, fadeInUp, viewportOnce } from "@/lib/motion";
import Logo from "../../public/Logo/Logo";

export function MarketingFooter() {
  const year = new Date().getFullYear();
  const cols = [
    {
      title: "Product",
      links: [
        { label: "Product", href: "#features", target: "" },
        { label: "How it works", href: "#how", target: "" },
        { label: "Pricing", href: "#pricing", target: "" },
        { label: "FAQ", href: "#faq", target: "" },
      ],
    },
    {
      title: "Social",
      links: [
        {
          label: "LinkedIn",
          href: "https://www.linkedin.com/in/neerajneerajweb/",
          target: "_blank",
        },
        { label: "ProductHunt", href: "#", target: "_blank" },
        {
          label: "Gmail",
          href: "mailto:nikatwork365@gmail.com",
          target: "_blank",
        },

        // { label: "Instagram", href: "#" },
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
      className="border-t border-border bg-background"
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
              Turn your resume into a beautiful, shareable digital business card
              in seconds.
            </p>
          </div>
          {cols.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-sm font-medium">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(({ label, href, target }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      target={target}
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
          <p>© {year} Kardably, Inc. All rights reserved.</p>
          <p>Made for people who network.</p>
        </div>
      </div>
    </motion.footer>
  );
}
