import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";

// In a real app, this would be fetched based on the slug
const postData = {
  title: "The Future of Generative Engine Optimization in B2B",
  author: "David Chen",
  date: "Oct 24, 2023",
  readTime: "8 min read",
  category: "Insights",
  content: [
    {
      type: "h2",
      text: "The Paradigm Shift in SEO",
    },
    {
      type: "p",
      text: "For the last two decades, digital marketing has been oriented around a single, predictable mechanic: a user types a query into a search bar, and a search engine provides a list of links. The goal for marketers was to be the first link. But that world is fundamentally changing with the rise of Generative Engines.",
    },
    {
      type: "p",
      text: "Generative AI like ChatGPT, Perplexity, and Google's SGE (Search Generative Experience) don't just provide links; they provide answers. This shift from 'search' to 'answer' requires a completely new discipline: Generative Engine Optimization (GEO).",
    },
    {
      type: "h2",
      text: "Why B2B Brands are at Higher Risk",
    },
    {
      type: "p",
      text: "B2B decision-making cycles are complex. Buyers are looking for comparisons, expert opinions, and deep technical validations. If an LLM summarizes a category and fails to mention your brand—or worse, summarizes your competitor as the 'best choice' based on its training data—your potential customer may never even discover your website.",
    },
    {
      type: "h3",
      text: "1. Brand Narrative Control",
    },
    {
      type: "p",
      text: "In the GEO era, you aren't just optimizing for keywords; you're optimizing for entities. LLMs build a world model based on relationships. If your brand isn't strongly associated with the right clusters of expertise, you'll be invisible in the generative response.",
    },
    {
      type: "h3",
      text: "2. The Importance of Citations",
    },
    {
      type: "p",
      text: "Citations are the new backlinks. Being the 'source' for a claim made by an AI model is the highest form of authority in modern search. We've seen that semantic structure and schema markup are the primary drivers of citation frequency.",
    },
    {
      type: "h2",
      text: "Preparing Your Team for 2024",
    },
    {
      type: "p",
      text: "As we move into 2024, the brands that win will be those that transition their SEO teams into GEO teams. This means moving beyond keyword density and into content authority, semantic connectivity, and engine visibility tracking.",
    },
  ],
};

export default function BlogPostPage() {
  return (
    <main className="bg-white dark:bg-black min-h-screen">
      {/* Article Header */}
      <section className="pt-24 pb-16 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 group font-medium">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{postData.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
            {postData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400">DC</div>
              <span className="font-bold text-slate-900 dark:text-white">{postData.author}</span>
            </div>
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {postData.date}</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {postData.readTime}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-16">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            {postData.content.map((block, i) => {
              if (block.type === "h2") return <h2 key={i} className="text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-6">{block.text}</h2>;
              if (block.type === "h3") return <h3 key={i} className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">{block.text}</h3>;
              return <p key={i} className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{block.text}</p>;
            })}
          </article>

          {/* Sidebar Tools */}
          <aside className="space-y-12">
            <div>
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-white/5 pb-2">Share</h4>
              <div className="flex flex-col gap-4">
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-200 dark:border-white/10 hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-200 dark:border-white/10 hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-200 dark:border-white/10 hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-200 dark:border-white/10 hover:text-primary transition-colors">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Want to track your GEO score?</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Get a complete diagnostic of your AI visibility in minutes.</p>
              <Button size="sm" className="w-full rounded-lg bg-primary font-bold">Try for Free</Button>
            </div>
          </aside>
        </div>
      </section>

      {/* Suggested Articles */}
      <section className="py-24 border-t border-slate-100 dark:border-white/5 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-10">You might also like...</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Link href="#" className="group flex gap-6 items-center">
                <div className="h-24 w-24 rounded-2xl bg-slate-100 dark:bg-slate-900 shrink-0"></div>
                <div>
                   <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">Measuring Attribution in the Age of SGE</h3>
                   <span className="text-xs text-slate-400 font-medium">6 min read • Analytics</span>
                </div>
             </Link>
             <Link href="#" className="group flex gap-6 items-center">
                <div className="h-24 w-24 rounded-2xl bg-slate-100 dark:bg-slate-900 shrink-0"></div>
                <div>
                   <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">Semantic Content Structuring for AI Agents</h3>
                   <span className="text-xs text-slate-400 font-medium">10 min read • Technical</span>
                </div>
             </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
