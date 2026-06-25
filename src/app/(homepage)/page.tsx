import Link from "next/link";
import * as motion from "motion/react-client";
import type { Metadata } from "next";
import {
  defaultTransition,
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";
// import {
//   ArrowRight,
//   Upload,
//   Sparkles,
//   Share2,
//   BarChart3,
//   QrCode,
//   Palette,
//   Zap,
//   ShieldCheck,
//   Check,
// } from "lucide-react";
import { MarketingNav } from "@/components/marketing-nav";
import { MarketingFooter } from "@/components/marketing-footer";
import { BusinessCard } from "@/components/business-card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BrushIcon,
  ChartIcon,
  CheckIcon,
  CloudUploadIcon,
  CreditCardIcon,
  PaintBoardIcon,
  QrCodeIcon,
  Share08Icon,
  Shield02Icon,
  SparklesIcon,
  Time04Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { PricingTable } from "@clerk/nextjs";
import Logo from "../../../public/Logo/Logo";
import { getTheme } from "@/lib/card-themes";
import CardStack from "@/lib/homepage-card/CardStack";
import { cards } from "@/lib/homepage-card/data";

export const metadata: Metadata = {
  description:
    "Upload your resume and let AI extract everything that matters. Pick a theme, refine the details, and share a polished business card by link or QR in seconds.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <main>
        <Hero />
        {/* <LogoCloud /> */}
        <HowItWorks />
        <Features />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <motion.div
          className="space-y-7"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={defaultTransition}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <HugeiconsIcon
              icon={SparklesIcon}
              size="14"
              className="text-primary dark:text-white"
            />
            AI-powered · Resume to Business Card
          </span>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Your Resume transform into a Business Card
          </h1>
          <p className="max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
            Upload your resume and let AI extract everything that matters. Pick
            a theme, refine the details, and share a polished card by link or QR
            code in seconds.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/create">
                <HugeiconsIcon icon={CreditCardIcon} />
                Build your card
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">View all cards</Link>
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon
                icon={PaintBoardIcon}
                className="dark:text-white text-primary"
                size={16}
              />{" "}
              No design skills
            </span>
            <span className="inline-flex items-center gap-1">
              <HugeiconsIcon
                icon={Time04Icon}
                className="dark:text-white text-primary"
                size={16}
              />{" "}
              Ready in 60 seconds
            </span>
          </div>
        </motion.div>
        <motion.div
          className="relative flex justify-center lg:justify-end py-4"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...defaultTransition, delay: 0.12 }}
        >
          <div aria-hidden className="py-8" />

          <CardStack cards={cards} mode="lift" />
        </motion.div>
      </div>
    </section>
  );
}

function LogoCloud() {
  const names = [
    "Northwind",
    "Lumen",
    "Cobalt",
    "Vertex",
    "Halcyon",
    "Pinnacle",
  ];
  return (
    <section className="border-y border-border bg-card/40">
      <motion.div
        className="mx-auto max-w-6xl px-4 py-10 sm:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        transition={defaultTransition}
      >
        <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by professionals at fast-moving teams
        </p>
        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
          variants={staggerContainer}
        >
          {names.map((n) => (
            <motion.span
              key={n}
              variants={staggerItem}
              className="text-lg font-semibold tracking-tight text-muted-foreground/70"
            >
              {n}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: CloudUploadIcon,
      title: "Upload your resume",
      desc: "Drop in a PDF or DOCX. We support every standard resume format.",
    },
    {
      icon: SparklesIcon,
      title: "AI extracts your details",
      desc: "Name, role, contact, skills and links — parsed and organized automatically.",
    },
    {
      icon: PaintBoardIcon,
      title: "Pick a theme & build",
      desc: "Choose a look, fine-tune any field, and publish your card instantly.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SectionHeading
        eyebrow="How it works"
        title="From resume to ready-to-share in three steps"
        subtitle="No templates to wrestle with. Just upload, refine, and share."
      />
      <motion.div
        className="mt-12 grid gap-6 md:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerContainer}
      >
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            variants={staggerItem}
            className="relative rounded-xl border border-border bg-card p-6"
          >
            <span className="text-sm font-medium text-primary dark:text-white">
              0{i + 1}
            </span>
            <div className="mt-4 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={s.icon} />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {s.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
      {/* <iframe
        src="http://localhost:3000/embed/miranda-martha-usqrxe"
        title="MIRANDA — Digital business card"
        width="100%"
        height="560"
        style="border:0;border-radius:12px;max-width:960px;min-height:480px;"
        loading="lazy"
      ></iframe> */}
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: SparklesIcon,
      title: "AI resume parsing",
      desc: "Accurate extraction of your experience, skills, and contact details — no copy-paste.",
    },
    {
      icon: PaintBoardIcon,
      title: "Beautiful themes",
      desc: "Hand-crafted card themes for every personality. Pro unlocks the full collection.",
    },
    {
      icon: Share08Icon,
      title: "Share by link",
      desc: "A clean, fast public page for your card with a memorable personal URL.",
    },
    {
      icon: QrCodeIcon,
      title: "QR codes",
      desc: "Generate a scannable QR for events, badges, and your email signature.",
    },
    {
      icon: ChartIcon,
      title: "Built-in analytics",
      desc: "Track views, unique visitors, locations, and which links get clicked.",
    },
    {
      icon: Shield02Icon,
      title: "You stay in control",
      desc: "Edit any field anytime in a simple side drawer. Unpublish whenever you like.",
    },
  ];
  return (
    <section id="features" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to network smarter"
          subtitle="A focused toolkit that turns a static document into a living, shareable identity."
        />
        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="rounded-xl border border-border bg-background p-6"
            >
              <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={f.icon} />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      cadence: "forever",
      desc: "Everything you need to launch one card.",
      features: [
        "1 business card",
        "3 starter themes",
        "Shareable link",
        "Basic view counts",
      ],
      cta: "Get started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$9",
      cadence: "per month",
      desc: "For people who network seriously.",
      features: [
        "Unlimited cards",
        "All premium themes",
        "QR codes + custom URL",
        "Full analytics suite",
        "Remove Cardably branding",
      ],
      cta: "Start Pro trial",
      highlighted: true,
    },
    {
      name: "Team",
      price: "$29",
      cadence: "per month",
      desc: "Consistent cards for your whole team.",
      features: [
        "Everything in Pro",
        "Shared brand kit",
        "Team directory",
        "Admin controls",
      ],
      cta: "Contact sales",
      highlighted: false,
    },
  ];
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple pricing that scales with you"
        subtitle="Start free. Upgrade when you want more cards, themes, and insight."
      />
      <motion.div
        className="relative z-[60] mt-12"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        transition={{ ...defaultTransition, delay: 0.08 }}
      >
        <PricingTable newSubscriptionRedirectUrl="/dashboard" />
        {/* {plans.map((plan) => (
          <div
            key={plan.name}
            className={
              "flex flex-col rounded-2xl border p-6 " +
              (plan.highlighted
                ? "border-primary bg-card shadow-lg shadow-primary/5 ring-1 ring-primary/20"
                : "border-border bg-card")
            }
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              {plan.highlighted && (
                <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">
                {plan.price}
              </span>
              <span className="text-sm text-muted-foreground">
                / {plan.cadence}
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <HugeiconsIcon icon={CheckIcon} />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="mt-8"
              variant={plan.highlighted ? "default" : "outline"}
            >
              <Link href="/sign-in">{plan.cta}</Link>
            </Button>
          </div>
        ))} */}
      </motion.div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "What file types can I upload?",
      a: "PDF and DOCX work best. Our AI reads the structure of your resume to pull out the right fields.",
    },
    {
      q: "Can I edit the information after it’s extracted?",
      a: "Absolutely. Every field is editable in a simple side drawer — change anything before or after publishing.",
    },
    {
      q: "Is there a free plan?",
      a: "Yes. You can build and share one card for free, forever. Upgrade to Pro for more cards and themes.",
    },
    {
      q: "How do analytics work?",
      a: "We track page views, unique visitors, and link clicks so you can see how your card performs.",
    },
  ];
  return (
    <section id="faq" className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <motion.div
          className="mt-10 divide-y divide-border rounded-xl border border-border bg-background"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
        >
          {faqs.map((f) => (
            <motion.div key={f.q} variants={staggerItem} className="p-6">
              <h3 className="font-medium">{f.q}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto">
      <motion.div
        className="relative overflow-hidden bg-card-foreground px-6 py-16 text-center text-background sm:px-12"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeInUp}
        transition={defaultTransition}
      >
        <HugeiconsIcon icon={CreditCardIcon} className="mx-auto" />
        {/* <Logo className="mx-auto" /> */}
        <h2 className="mx-auto mt-4 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Make a first impression that lasts
        </h2>
        <p className="mx-auto mt-3 max-w-md text-pretty text-background/70">
          Build your digital business card from your resume today — it only
          takes a minute.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-8">
          <Link href="/create">
            Get started free
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      className="mx-auto max-w-2xl text-center"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeInUp}
      transition={defaultTransition}
    >
      <p className="text-sm font-medium text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-pretty text-muted-foreground">{subtitle}</p>
      )}
    </motion.div>
  );
}
