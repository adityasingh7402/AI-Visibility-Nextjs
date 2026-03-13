import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";

export const metadata = {
  title: "Blog | GEO Platform",
  description: "Latest insights on AI search, Generative Engine Optimization, and the future of B2B digital marketing.",
};

interface BlogPost {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

const posts: BlogPost[] = [
  {
    title: "The Future of Generative Engine Optimization in B2B",
    excerpt: "Discover how AI-driven search engines are reshaping the digital marketing landscape and what your brand needs to do to stay ahead.",
    author: "David Chen",
    date: "Oct 24, 2023",
    readTime: "8 min read",
    category: "Insights",
    slug: "future-of-geo-b2b",
  },
  {
    title: "Measuring Attribution in the Age of SGE",
    excerpt: "New frameworks for understanding how users interact with AI-generated answers and the impact on click-through rates.",
    author: "Sarah Miller",
    date: "Oct 19, 2023",
    readTime: "6 min read",
    category: "Analytics",
    slug: "measuring-attribution-sge",
  },
  {
    title: "Semantic Content Structuring for AI Agents",
    excerpt: "Why your CMS structure matters more than ever for being cited as a top source in generative search results.",
    author: "Alex Rivera",
    date: "Oct 12, 2023",
    readTime: "10 min read",
    category: "Technical",
    slug: "semantic-content-structuring",
  },
  {
    title: "Building the Ultimate GEO Dashboard",
    excerpt: "Step-by-step guide to tracking share of voice across ChatGPT, Claude, and Google Search in one view.",
    author: "Marcus Thorne",
    date: "Oct 5, 2023",
    readTime: "12 min read",
    category: "Tutorial",
    slug: "ultimate-geo-dashboard",
  },
];

export default function BlogListPage() {
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="bg-background-light dark:bg-black w-full min-h-screen">
      {/* Blog Hero */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-200 dark:border-white/5 pb-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                Latest Insights
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-xl">
                Expert analysis and guides on the intersection of AI, search, and B2B growth.
              </p>
            </div>
            <div className="flex gap-2">
              {["All", "Insights", "Technical", "Analytics", "Tutorial"].map((cat) => (
                <Button key={cat} variant="outline" size="sm" className="rounded-full border-slate-200 dark:border-white/10 dark:text-white">
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          <Link href={`/blog/${featuredPost.slug}`} className="group block mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5 transition-transform hover:scale-[1.01]">
              <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden relative">
                {/* Placeholder for featured image */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-700 font-bold text-2xl italic">
                  GEO-INSIGHT-01.JPG
                </div>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Featured</span>
                  <span className="text-slate-400 text-sm">{featuredPost.category}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 mb-8 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-2"><User className="h-4 w-4" /> {featuredPost.author}</span>
                  <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {featuredPost.date}</span>
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {featuredPost.readTime}</span>
                </div>
                <Button className="group/btn rounded-xl font-bold bg-primary hover:bg-blue-600 text-white px-8 py-6">
                  Read Article
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Link>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
            {remainingPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-all h-full">
                <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-2xl mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-200 dark:text-slate-800 font-bold italic">
                    {post.category}
                  </div>
                </div>
                <div className="flex-grow">
                  <span className="text-sm font-bold text-primary mb-3 block uppercase tracking-tight">{post.category}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium"><User className="h-3.5 w-3.5" /> {post.author}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-6">Stay ahead of the AI shift</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Get bi-weekly insights on Generative Engine Optimization delivered straight to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow h-14 px-6 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 font-bold h-14 px-8 rounded-xl shadow-lg">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
