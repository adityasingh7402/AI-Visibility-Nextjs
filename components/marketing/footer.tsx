import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-white/10 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary text-primary-foreground p-1 rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">query_stats</span>
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">GEO</span>
            </div>
            <p className="text-slate-500 max-w-xs leading-relaxed dark:text-slate-400">
              The world's first comprehensive platform for Generative Engine Optimization.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Platform</h5>
            <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
              <li><Link className="hover:text-primary" href="/dashboard">Dashboard</Link></li>
              <li><Link className="hover:text-primary" href="/dashboard/reports">Reporting</Link></li>
              <li><Link className="hover:text-primary" href="/settings/integrations">Integrations</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Company</h5>
            <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
              <li><Link className="hover:text-primary" href="/about">About</Link></li>
              <li><Link className="hover:text-primary" href="/blog">Blog</Link></li>
              <li><Link className="hover:text-primary" href="/careers">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Legal</h5>
            <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
              <li><Link className="hover:text-primary" href="/privacy">Privacy</Link></li>
              <li><Link className="hover:text-primary" href="/terms">Terms</Link></li>
              <li><Link className="hover:text-primary" href="/security">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 dark:border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">© 2026 GEO Platform Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-slate-400 hover:text-primary transition-colors" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a className="text-slate-400 hover:text-primary transition-colors" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <span className="material-symbols-outlined">share</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
