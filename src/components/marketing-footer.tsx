import Link from "next/link";
import Logo from "../../public/Logo/Logo";

export function MarketingFooter() {
  const cols = [
    {
      title: "Product",
      links: ["Features", "Themes", "Analytics", "Pricing"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Contact"],
    },
    {
      title: "Resources",
      links: ["Help center", "Guides", "API", "Status"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Security", "Cookies"],
    },
  ];
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
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
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
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
    </footer>
  );
}
