import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-black font-sans">
      <div className="flex flex-col justify-center px-6 py-12 lg:px-24 bg-white dark:bg-black relative z-10">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="flex items-center gap-2 mb-12 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">G</div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:text-primary transition-colors">GEO</span>
          </Link>
          {children}
        </div>
      </div>
      
      {/* Decorative side section */}
      <div className="hidden lg:flex flex-col justify-center bg-slate-900 px-24 py-12 relative overflow-hidden">
        {/* Background mesh/gradients */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent)] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-12 shadow-2xl">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-bold text-lg">GEO Performance</h3>
                <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-md">Live Platform Data</span>
             </div>
             
             <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="space-y-1">
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Citations</p>
                   <p className="text-3xl font-black text-white">+12.4%</p>
                </div>
                <div className="space-y-1">
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Visibility</p>
                   <p className="text-3xl font-black text-white">Top 3 Rank</p>
                </div>
             </div>

             <div className="h-32 w-full bg-slate-800/50 rounded-xl relative overflow-hidden flex items-end p-4">
                {/* Visual representation of a chart or something */}
                <div className="absolute inset-0 flex items-end justify-between px-4 pb-2">
                   {[
                     { h: 40 }, { h: 60 }, { h: 45 }, { h: 75 },
                     { h: 55 }, { h: 90 }, { h: 85 },
                   ].map(({ h }, i) => (
                      <div key={i} className={`w-4 bg-primary rounded-t-sm ${
                        h === 40 ? 'h-[40%]' :
                        h === 60 ? 'h-[60%]' :
                        h === 45 ? 'h-[45%]' :
                        h === 75 ? 'h-[75%]' :
                        h === 55 ? 'h-[55%]' :
                        h === 90 ? 'h-[90%]' : 'h-[85%]'
                      }`}></div>
                   ))}
                </div>
             </div>
          </div>

          <blockquote className="space-y-6">
            <p className="text-2xl font-medium text-white leading-relaxed italic">
              &ldquo;GEO has transformed how we approach search. We saw a 40% increase in AI-generated citations within the first month.&rdquo;
            </p>
            <footer className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-slate-400">JD</div>
              <div>
                <cite className="not-italic font-bold text-white text-lg">Jane Doe</cite>
                <p className="text-slate-400 text-sm">Director of Digital Strategy, Enterprise Hub</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
