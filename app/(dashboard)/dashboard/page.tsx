import { 
  TrendingUp, 
  BarChart3, 
  MessageSquare, 
  ArrowUpRight, 
  Plus, 
  MoreHorizontal,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard | GEO Platform",
};

export default function DashboardPage() {
  const stats = [
    { label: "Total Analyses", value: "1,284", change: "+12.4%", icon: <BarChart3 className="text-primary" /> },
    { label: "Avg GEO Score", value: "78%", change: "+5.1%", icon: <TrendingUp className="text-emerald-500" /> },
    { label: "Mentions this week", value: "422", change: "+8.2%", icon: <MessageSquare className="text-blue-500" /> },
  ];

  const recentReports = [
    { id: "REP-4829", title: "Enterprise Hub Q4 Audit", score: 82, date: "2 hours ago", status: "Completed" },
    { id: "REP-4828", title: "SaaS Competitor Map", score: 71, date: "5 hours ago", status: "Completed" },
    { id: "REP-4827", title: "Product Launch Baseline", score: 65, date: "1 day ago", status: "In Progress" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Welcome back, Alex</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Here's your GEO performance overview for this month.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="bg-white dark:bg-slate-900 rounded-xl font-bold h-11 border-slate-200 dark:border-white/5 dark:text-white">Export Data</Button>
           <Button className="bg-primary hover:bg-blue-600 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
             <Plus className="h-4 w-4 mr-2" />
             New Project
           </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-2xl">
                   {stat.icon}
                </div>
                <span className="flex items-center text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg italic">
                   <ArrowUpRight className="h-3 w-3 mr-0.5" />
                   {stat.change}
                </span>
             </div>
             <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
             <p className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GEO Score Trend (Large Chart Placeholder) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">GEO Score Trend</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Performance across all generative engines</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="h-5 w-5 text-slate-400" /></Button>
           </div>
           
           <div className="h-72 w-full bg-slate-50 dark:bg-black/40 rounded-2xl relative flex items-end px-8 pb-10 border border-slate-100 dark:border-white/5">
              {/* Fake Chart bars */}
              <div className="flex items-end justify-between w-full gap-4">
                 {[40, 55, 65, 50, 80, 75, 90, 85, 95, 88].map((h, i) => (
                    <div key={i} className="flex-grow max-w-[40px] bg-primary/20 hover:bg-primary transition-all rounded-t-lg group relative" style={{ height: `${h}%` }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {h}%
                       </div>
                    </div>
                 ))}
              </div>
              <div className="absolute bottom-4 left-8 right-8 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <span>Jan</span>
                 <span>Mar</span>
                 <span>May</span>
                 <span>Jul</span>
                 <span>Sep</span>
                 <span>Nov</span>
              </div>
           </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Reports</h3>
              <Button variant="link" className="text-primary font-bold p-0 h-auto">View all</Button>
           </div>
           
           <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{report.id}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                        report.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                      }`}>
                        {report.status}
                      </span>
                   </div>
                   <h4 className="font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">{report.title}</h4>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-primary" style={{ width: `${report.score}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-white">{report.score}%</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                   </div>
                </div>
              ))}
           </div>
           
           <Button className="w-full mt-8 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 font-bold py-6 rounded-2xl">
             Download All
           </Button>
        </div>
      </div>
    </div>
  );
}
