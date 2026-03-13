import { ChevronRight, Rocket, BookOpen, Key, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Documentation | GEO Platform",
  description: "Master Generative Engine Optimization. Learn how to optimize your digital presence for the new era of AI search and generative responses.",
};

export default function DocsPage() {
  const getStartedItems = [
    {
      title: "Create your first project",
      description: "Set up your workspace and start your first SEO-to-GEO optimization campaign in minutes.",
      icon: <Rocket className="h-6 w-6 text-primary" />,
    },
    {
      title: "Understand GEO Score",
      description: "Deep dive into our proprietary scoring algorithm and how it measures your engine visibility.",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
    },
    {
      title: "API Authentication",
      description: "Securely connect your internal tools to GEO data via our robust REST and GraphQL APIs.",
      icon: <Key className="h-6 w-6 text-primary" />,
    },
    {
      title: "Manage Clients",
      description: "Agency-ready tools for multi-tenant management and collaborative reporting features.",
      icon: <Users className="h-6 w-6 text-primary" />,
    },
  ];

  const popularTopics = [
    "Content Semantic Structuring for LLMs",
    "Automating Citations with Schema.org",
    "Competitor Benchmarking in AI Search",
    "Voice Search vs. Generative Engine Optimization",
    "Handling Hallucinations in Brand Mentions",
    "Setting up Webhooks for Live Monitoring",
  ];

  return (
    <main className="bg-background-light dark:bg-black w-full min-h-screen">
      {/* Search/Header Section */}
      <section className="pt-24 pb-16 px-6 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            Welcome to GEO Platform Docs
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Master Generative Engine Optimization. Learn how to optimize your digital presence for the new era of AI search and generative responses.
          </p>
          <div className="max-w-xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Search documentation..." 
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
            />
            <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400">search</span>
          </div>
        </div>
      </section>

      {/* Getting Started Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-10">Getting Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getStartedItems.map((item, i) => (
              <Link 
                key={i} 
                href="#" 
                className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-primary transition-colors shadow-sm flex gap-6 group"
              >
                <div className="bg-primary/10 p-3 rounded-xl h-fit">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    {item.title}
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Popular Topics</h2>
              <p className="text-slate-500 dark:text-slate-400">Essential guides to master AI visibility.</p>
            </div>
            <Button variant="link" className="text-primary font-bold p-0 h-auto">
              View all articles
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTopics.map((topic, i) => (
              <Link 
                key={i} 
                href="#" 
                className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-white/5 hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors flex items-center justify-between group"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{topic}</span>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-slate-900 dark:bg-slate-800 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Need more help?</h2>
          <p className="text-slate-400 mb-8 text-lg">
            Can't find what you're looking for? Our support team is here to help with your technical questions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-blue-600 text-white font-bold px-8 py-6 rounded-xl w-full sm:w-auto">
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 font-bold px-8 py-6 rounded-xl w-full sm:w-auto">
              Visit Community
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
