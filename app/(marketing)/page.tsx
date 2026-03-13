import { Button } from "@/components/ui/button";

export default function MarketingLandingPage() {
  return (
    <main className="bg-background-light dark:bg-black w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
            Is Your Brand <span className="text-primary">Invisible</span> to AI Search?
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 dark:text-slate-400">
            Standard SEO is dead. Analyze and optimize your visibility across ChatGPT, Perplexity, and Gemini with our enterprise-grade GEO toolkit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button size="lg" className="px-8 py-6 rounded-xl text-lg font-bold hover:scale-105 transition-transform shadow-xl shadow-primary/30">
              Get Your GEO Score
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 rounded-xl text-lg font-bold">
              Watch Demo
            </Button>
          </div>
        </div>
        
        {/* Dashboard Preview */}
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-4 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-4 mb-6 px-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <div className="ml-4 h-6 w-1/2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-white/5"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4">
              <div className="col-span-1 md:col-span-4 aspect-square rounded-full border-[12px] border-emerald-500 border-t-slate-100 dark:border-t-slate-800 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-900 dark:text-white">84</span>
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">GEO Score</span>
              </div>
              <div className="col-span-1 md:col-span-8 space-y-4">
                <div className="h-32 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex flex-col justify-end gap-2">
                  <div className="flex items-end gap-2 h-full">
                    <div className="bg-primary/20 w-full h-1/4 rounded-t"></div>
                    <div className="bg-primary/30 w-full h-2/4 rounded-t"></div>
                    <div className="bg-primary/40 w-full h-3/4 rounded-t"></div>
                    <div className="bg-primary w-full h-full rounded-t"></div>
                    <div className="bg-primary/60 w-full h-4/5 rounded-t"></div>
                  </div>
                  <p className="text-xs font-bold text-slate-400">Visibility Growth (30d)</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">+12%</span>
                    <span className="text-xs text-slate-500 uppercase">Brand Citations</span>
                  </div>
                  <div className="h-24 bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex flex-col justify-center">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">0.82</span>
                    <span className="text-xs text-slate-500 uppercase">Sentiment Ratio</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-black/20 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-white dark:bg-slate-950 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Standard SEO is Failing You</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">The shift to LLM-driven search requires a new paradigm of discovery.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">trending_down</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Answer Engine Dominance</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Traditional keywords no longer drive traffic from LLMs like Perplexity or ChatGPT.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">ads_click</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Zero-Click Search Growth</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Users get answers directly from AI interfaces without ever visiting your website.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">voice_over_off</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Loss of Brand Voice</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">AI models often hallucinate or misrepresent your brand values in their summaries.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">A systematic approach to winning the generative search era.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-slate-200 dark:bg-slate-700 z-0"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-6 border-8 border-slate-50 dark:border-slate-900/50">1</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Analyze</h3>
            <p className="text-slate-500 dark:text-slate-400">Crawl LLM knowledge graphs to see how your brand is currently perceived.</p>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-6 border-8 border-slate-50 dark:border-slate-900/50">2</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Diagnose</h3>
            <p className="text-slate-500 dark:text-slate-400">Identify visibility gaps and attribution errors across 15+ generative engines.</p>
          </div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-6 border-8 border-slate-50 dark:border-slate-900/50">3</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Fix</h3>
            <p className="text-slate-500 dark:text-slate-400">Deploy semantic structural changes and authority signals to boost ranking.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white dark:bg-slate-950 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Technical Capabilities</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Built for high-performance marketing teams.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl flex flex-col justify-between border border-slate-100 dark:border-white/5">
              <div>
                <span className="material-symbols-outlined text-4xl text-primary mb-4">psychology_alt</span>
                <h3 className="text-2xl font-bold mb-4 dark:text-white">Prompt Style Analysis</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">Understand which user query styles (instructional, creative, or analytical) trigger your brand mentions most frequently.</p>
              </div>
              <div className="mt-8 bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
                <div className="flex gap-2">
                  <div className="w-full h-2 bg-primary rounded"></div>
                  <div className="w-1/2 h-2 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 dark:bg-slate-800 text-white p-10 rounded-3xl border border-slate-800 dark:border-white/5">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">hub</span>
              <h3 className="text-2xl font-bold mb-4">Citation Mapping</h3>
              <p className="text-slate-400">Map the exact sources LLMs use to verify your claims and identify backlink opportunities.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-white/5">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">monitoring</span>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Rank Tracking</h3>
              <p className="text-slate-500 dark:text-slate-400">Daily snapshots of your visibility index across 500+ key commercial prompts.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-white/5">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">security</span>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Hallucination Alerts</h3>
              <p className="text-slate-500 dark:text-slate-400">Instant notifications when AI engines output incorrect pricing or false facts about your brand.</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-white/5">
              <span className="material-symbols-outlined text-4xl text-primary mb-4">language</span>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Multi-Engine Support</h3>
              <p className="text-slate-500 dark:text-slate-400">Optimized for GPT-4, Claude 3, Gemini Ultra, and specialized vertical engines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12 dark:text-white">How We Compare</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-white/5">
                  <th className="p-6 font-bold text-slate-500 dark:text-slate-400">Features</th>
                  <th className="p-6 font-black text-primary text-center">GEO Platform</th>
                  <th className="p-6 font-bold text-slate-500 dark:text-slate-400 text-center">Traditional SEO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                <tr>
                  <td className="p-6 font-semibold text-slate-700 dark:text-slate-300">Semantic Link Analysis</td>
                  <td className="p-6 text-center"><span className="material-symbols-outlined text-emerald-500 font-bold">check_circle</span></td>
                  <td className="p-6 text-center"><span className="material-symbols-outlined text-slate-300 dark:text-slate-700">cancel</span></td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-slate-700 dark:text-slate-300">LLM Hallucination Monitoring</td>
                  <td className="p-6 text-center"><span className="material-symbols-outlined text-emerald-500 font-bold">check_circle</span></td>
                  <td className="p-6 text-center"><span className="material-symbols-outlined text-slate-300 dark:text-slate-700">cancel</span></td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-slate-700 dark:text-slate-300">Keyword Difficulty Scoring</td>
                  <td className="p-6 text-center"><span className="material-symbols-outlined text-emerald-500 font-bold">check_circle</span></td>
                  <td className="p-6 text-center"><span className="material-symbols-outlined text-emerald-500 font-bold">check_circle</span></td>
                </tr>
                <tr>
                  <td className="p-6 font-semibold text-slate-700 dark:text-slate-300">Generative Citations Tracker</td>
                  <td className="p-6 text-center"><span className="material-symbols-outlined text-emerald-500 font-bold">check_circle</span></td>
                  <td className="p-6 text-center"><span className="material-symbols-outlined text-slate-300 dark:text-slate-700">cancel</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white dark:bg-slate-950 px-6" id="pricing">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">Scale your GEO presence as you grow.</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2 dark:text-white">Starter</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black dark:text-white">$99</span>
              <span className="text-slate-500 dark:text-slate-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-emerald-500 text-sm">check</span> 5,000 Prompt Analysis</li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-emerald-500 text-sm">check</span> 2 Search Engines</li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-emerald-500 text-sm">check</span> Weekly Reports</li>
            </ul>
            <Button variant="outline" className="w-full py-6 rounded-xl font-bold">Start Trial</Button>
          </div>
          {/* Pro */}
          <div className="bg-slate-900 dark:bg-slate-800 text-white p-10 rounded-3xl border border-slate-800 dark:border-white/10 ring-4 ring-primary ring-offset-4 ring-offset-white dark:ring-offset-black flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">Pro</h3>
              <span className="bg-primary text-primary-foreground text-[10px] uppercase font-black px-2 py-1 rounded">Popular</span>
            </div>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black">$299</span>
              <span className="text-slate-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-2 text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check</span> 50,000 Prompt Analysis</li>
              <li className="flex items-center gap-2 text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check</span> All Search Engines</li>
              <li className="flex items-center gap-2 text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check</span> Real-time Alerts</li>
              <li className="flex items-center gap-2 text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check</span> API Access</li>
            </ul>
            <Button className="w-full py-6 rounded-xl font-bold">Start Trial</Button>
          </div>
          {/* Enterprise */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col h-full">
            <h3 className="text-xl font-bold mb-2 dark:text-white">Enterprise</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black dark:text-white">Custom</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-emerald-500 text-sm">check</span> Unlimited Analysis</li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-emerald-500 text-sm">check</span> Custom Integrations</li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-emerald-500 text-sm">check</span> Dedicated Strategist</li>
            </ul>
            <Button variant="outline" className="w-full py-6 rounded-xl font-bold">Contact Sales</Button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto bg-primary rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Claim Your AI Search Future</h2>
            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">Don't let your brand get lost in the noise of generative answers. Start optimizing today.</p>
            <Button size="lg" variant="secondary" className="px-10 py-8 rounded-2xl text-xl font-black hover:scale-105 transition-transform text-primary">
              Get Your Free Audit
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        </div>
      </section>
    </main>
  );
}
