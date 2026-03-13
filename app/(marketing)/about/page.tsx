import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | GEO Platform",
  description: "Learn how GEO Platform is redefine visibility for the Generative Era. We help B2B leaders ensure their narrative isn't lost in the LLM black box.",
};

export default function AboutPage() {
  return (
    <main className="bg-background-light dark:bg-black w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
            Redefining visibility for the <span className="text-primary italic">Generative Era</span>.
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            From the era of SEO to the future of AI search, we are redefining how brands stay visible in the age of Generative Engine Optimization. We help B2B leaders ensure their narrative isn't lost in the LLM black box.
          </p>
        </div>
      </section>

      {/* The Problem We Solve */}
      <section className="py-24 bg-white dark:bg-slate-950 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">The Problem We Solve</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">Traditional search is dead. AI agents are the new gatekeepers.</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-white/5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">LLM Visibility Gap</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Traditional SEO strategies are designed for keyword matching. Generative engines use semantic synthesis, creating a visibility gap for legacy brands.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-white/5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Algorithmic Shifts</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Adapting to how LLMs process your brand info requires deep technical insights into vector embeddings and training data influence.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-white/5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Data Fragmentation</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Unifying insights across multiple generative engines like ChatGPT, Claude, and Gemini is the only way to maintain a consistent brand voice.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Meet the Team</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400">The minds behind the future of search visibility.</p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Sarah Chen", role: "CEO & Founder" },
            { name: "Marcus Vane", role: "CTO" },
            { name: "Elena Rodriguez", role: "Head of AI Research" },
            { name: "David Park", role: "Product Lead" },
          ].map((member, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full bg-slate-200 dark:bg-slate-800 mb-6 shadow-md border-4 border-white dark:border-slate-700"></div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h4>
              <p className="text-primary font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Join our mission to democratize AI visibility.</h2>
          <Button size="lg" className="px-8 py-6 rounded-xl text-lg font-bold">
            View Open Positions
          </Button>
        </div>
      </section>
    </main>
  );
}
