"use client";
import Link from "next/link";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Integrations", href: "/settings/integrations" },
      { label: "Documentation", href: "/docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Reports", href: "/dashboard/reports" },
      { label: "Support", href: "/support" },
      { label: "Guides", href: "/docs/guides" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-zinc-950 text-zinc-400 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8 sm:px-6 lg:px-8">

        {/* Main grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 rounded bg-white flex items-center justify-center shrink-0">
                <span className="text-zinc-900 font-bold text-xs">G</span>
              </div>
              <span className="font-schibsted text-white font-semibold tracking-tight">
                GEO Platform
              </span>
            </div>
            <p className="font-schibsted text-sm leading-relaxed text-pretty">
              The world&apos;s first comprehensive platform for Generative Engine
              Optimization — track, analyze, and grow your AI visibility.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-schibsted text-xs font-semibold text-white uppercase tracking-wider mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-schibsted text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex gap-4 flex-wrap">
            <span className="font-schibsted text-xs">© 2026 GEO Platform Inc.</span>
            <Link href="/terms" className="font-schibsted text-xs hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="font-schibsted text-xs hover:text-white transition-colors">
              Privacy
            </Link>
          </div>

          {/* Email subscribe */}
          <form
            className="w-full max-w-sm relative"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="font-schibsted w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-zinc-600"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-zinc-900 size-8 rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors"
            >
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </footer>
  );
}
