import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-black/80 dark:border-white/10">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">query_stats</span>
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">GEO</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors dark:text-slate-300">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors dark:text-slate-300">
            Pricing
          </Link>
          <Link href="/resources" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors dark:text-slate-300">
            Resources
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-900 dark:text-white px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all">
            Log In
          </Link>
          <Button className="bg-primary text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-blue-600 shadow-lg shadow-primary/20 transition-all">
            Start Free Trial
          </Button>
        </div>
      </nav>
    </header>
  );
}
