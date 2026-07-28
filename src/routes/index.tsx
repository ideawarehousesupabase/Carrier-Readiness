import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, ArrowRight, ShieldCheck, FileCheck2, Activity, Network, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Landing });

const phases = [
  {
    n: "01",
    tag: "REGISTER",
    title: "Carrier Registration & Readiness Profile",
    body:
      "Capture identity documents, insurance certificates, route capabilities, safety ratings, and service-specific certifications to build a comprehensive Carrier Readiness Profile and baseline Onboarding Readiness Score.",
    body2:
      "The Registration phase surfaces the hidden compliance gaps in your existing carrier pool — giving you a precise, data-driven view of your \"Readiness Gap\" before any load is tendered.",
    image: "/phase-register.jpg",
    tags: ["Automated Profile Capture", "Baseline Readiness Score", "Zero Code Required"],
    reverse: false,
  },
  {
    n: "02",
    tag: "COLLECT",
    title: "Document Collection & Real-Time Verification",
    body:
      "The Document Engine ingests live data from your carrier submissions tracking insurance expiry, ELD certificates, safety ratings, and rate card agreements on a continuous basis. Automated alerts flag compliance stalls the moment they emerge.",
    body2:
      "Think of it as a 24/7 compliance manager watching every carrier document — objective, continuous, and immediately actionable.",
    image: "/phase-collect.jpg",
    tags: ["Live Document Engine", "Expiry Tracking", "Instant Alerts"],
    reverse: true,
  },
  {
    n: "03",
    tag: "VERIFY",
    title: "Catch Compliance Failures Before They Cost You",
    body:
      "The RFFE cross-checks submitted carrier data against required documentation standards. Missing W-9? Sub-threshold safety rating? Expired ELD? The RFFE catches them all and automatically deconstructs the gap into a structured \"Readiness Report\" with one-click resolution options.",
    image: "/phase-compliance.jpg",
    tags: ["Automated Failure Detection", "Readiness-Failure Forensics"],
    reverse: false,
  },
  {
    n: "04",
    tag: "ACTIVATE",
    title: "Risk & Compliance Check — Service-Specific Carrier Activation",
    body:
      "When a carrier passes all readiness gates, the Operational Permission Engine activates them for specific lanes with surgical precision — Pharma, Reefer, Hazmat, General Haulage — while blocking them from unrelated load types. The platform resolves 85% of compliance conflicts without manual intervention.",
    image: "/phase-activate.jpg",
    tags: ["Lane-Specific Activation", "85% Auto-Resolution"],
    reverse: true,
  },
  {
    n: "05",
    tag: "BENCHMARK",
    title: "Community Readiness Network — Learn From the Best",
    body:
      "The CRN enables anonymised \"Readiness DNA\" benchmarks from thousands of logistics firms to improve predictive models continuously. Carrier reliability trends from high-efficiency US freight corridors can inform a UK mid-sized broker's network strategy without revealing sensitive commercial data.",
    image: "/phase-benchmark.jpg",
    tags: ["Sector-Wide Efficiency Insights", "Privacy-Safe Benchmarking"],
    reverse: false,
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-primary text-primary-foreground shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground/15">
              <Truck className="h-6 w-6" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold tracking-tight">CarrierReadiness</div>
              <div className="text-[10px] uppercase tracking-[0.18em] opacity-80">Carrier Onboarding Intelligence</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium tracking-wide lg:flex">
            {["HOME", "ABOUT", "PLATFORM", "MARKET", "PROCESS"].map((l, i) => (
              <a key={l} href="#process" className={`hover:opacity-100 ${i === 4 ? "border-b-2 border-accent pb-0.5" : "opacity-90"}`}>{l}</a>
            ))}
          </nav>
          <Link to="/auth/register">
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold">GET STARTED</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-beige">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <div>
            <div className="mb-4 text-xs font-semibold tracking-[0.2em] text-accent">CARRIER ONBOARDING READINESS PLATFORM</div>
            <h1 className="text-5xl font-extrabold leading-tight text-primary lg:text-6xl">
              Onboard carriers with <span className="text-accent">precision</span>, not paperwork.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary/80">
              CORP is the UK's first AI-powered Carrier Onboarding Readiness platform — verify compliance, score readiness, and activate carriers across the right lanes in days, not weeks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth/register">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { k: "20+", v: "Carriers" },
                { k: "98%", v: "Compliance" },
                { k: "5", v: "Readiness gates" },
              ].map((s) => (
                <div key={s.v} className="rounded-lg border border-primary/15 bg-card/60 p-3 text-center">
                  <div className="text-2xl font-bold text-accent">{s.k}</div>
                  <div className="text-xs text-primary/70">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-primary/10 blur-2xl" />
            <img src="/hero-trucks.jpg" alt="Logistics fleet" className="relative rounded-2xl shadow-2xl" width={1024} height={1024} />
          </div>
        </div>
      </section>

      {/* Feature Strip */}
      <section className="border-y border-beige-deep bg-beige-deep/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-4">
          {[
            { i: ShieldCheck, t: "Compliance Center", d: "Live document, insurance & safety verification." },
            { i: FileCheck2, t: "Readiness Scoring", d: "Objective 0–100 scores across every gate." },
            { i: Activity, t: "Risk Visibility", d: "Continuous monitoring with early-warning alerts." },
            { i: Network, t: "Service Activation", d: "Lane-specific carrier permissions, automated." },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-primary">{t}</div>
                <div className="text-sm text-primary/70">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Phases */}
      <section id="process" className="bg-beige">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold tracking-[0.2em] text-accent">THE PROCESS</div>
            <h2 className="mt-3 text-4xl font-bold text-primary">Five readiness phases. One unified platform.</h2>
            <p className="mt-4 text-primary/70">From registration to activation to community benchmarking — every step instrumented, every gap visible.</p>
          </div>

          <div className="mt-16 space-y-24">
            {phases.map((p) => (
              <div key={p.n} className={`grid items-center gap-12 lg:grid-cols-2 ${p.reverse ? "lg:[&>div:first-child]:order-2" : ""}`}>
                <div>
                  <div className="mb-3 text-sm font-semibold tracking-widest text-accent">
                    PHASE {p.n} &nbsp;·&nbsp; {p.tag}
                  </div>
                  <h3 className="text-3xl font-bold leading-tight text-primary lg:text-4xl">{p.title}</h3>
                  <p className="mt-5 text-base leading-relaxed text-primary/75">{p.body}</p>
                  {p.body2 && <p className="mt-4 text-base leading-relaxed text-primary/75">{p.body2}</p>}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-card px-3 py-1 text-xs font-medium text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <img src={p.image} alt={p.title} loading="lazy" width={1024} height={1024} className="rounded-2xl shadow-xl ring-1 ring-primary/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center">
          <h2 className="text-4xl font-bold">Ready to close your Readiness Gap?</h2>
          <p className="max-w-2xl opacity-90">See how CORP scores every carrier in your network and unlocks the right lanes — automatically.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/auth/register">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                Explore Dashboard
              </Button>
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm opacity-80">
            {["SOC2-aligned", "GDPR-ready", "Built for 3PLs & Brokers"].map((x) => (
              <span key={x} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> {x}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-blue-deep text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
          <div>
            <div className="text-2xl font-bold">CarrierReadiness</div>
            <p className="mt-3 text-sm opacity-80">The UK's first AI-powered Carrier Onboarding Readiness platform.</p>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest opacity-70">PLATFORM</div>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Readiness-Gate Architecture</li>
              <li>Readiness-Failure Forensics</li>
              <li>Community Readiness Network</li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest opacity-70">COMPANY</div>
            <ul className="space-y-2 text-sm opacity-90">
              <li>About CarrierReadiness</li>
              <li>Founder & CEO</li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold tracking-widest opacity-70">SOLUTIONS</div>
            <ul className="space-y-2 text-sm opacity-90">
              <li>3PL Brokerages</li>
              <li>Food Distribution / Cold-Chain</li>
              <li>Pharma & Hazmat</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 py-5 text-center text-xs opacity-70">
          © {new Date().getFullYear()} CarrierReadiness — Carrier Onboarding Readiness Platform
        </div>
      </footer>
    </div>
  );
}
