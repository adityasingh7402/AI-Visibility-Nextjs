import { 
  TrendingUp, 
  Users, 
  Zap, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  LayoutGrid,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  CreditCard,
  Clock,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Super Admin | GEO SaaS",
};

export default function AdminOverviewPage() {
  const metrics = [
    { label: "Total MRR", value: "$142,400", change: "+14.2%", trend: "up", icon: <CreditCard className="text-primary" /> },
    { label: "Active Users", value: "12,482", change: "+8.1%", trend: "up", icon: <Users className="text-blue-500" /> },
    { label: "Total API Calls Today", value: "892,104", change: "-2.4%", trend: "down", icon: <Zap className="text-amber-500" /> },
    { label: "System Error Rate", value: "0.04%", change: "-0.01%", trend: "up", icon: <Activity className="text-emerald-500" /> },
  ];

  const systemActivity = [
    { 
      type: "signup", 
      title: "New Signup: TechFlow Solutions", 
      desc: "Enterprise workspace created • ID: #TF-9021", 
      time: "2 mins ago", 
      icon: <Plus className="text-blue-500" />,
      bg: "bg-blue-500/10"
    },
    { 
      type: "upgrade", 
      title: "Plan Upgrade: Creative Pulse", 
      desc: "Pro → Enterprise Plan • +15 user seats added", 
      time: "14 mins ago", 
      icon: <TrendingUp className="text-emerald-500" />,
      bg: "bg-emerald-500/10"
    },
    { 
      type: "alert", 
      title: "Critical Alert: High Latency Detected", 
      desc: "US-East-1 region API response time > 1500ms", 
      time: "28 mins ago", 
      icon: <AlertTriangle className="text-amber-500" />,
      bg: "bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
    },
    { 
      type: "error", 
      title: "API Timeout: Claude 3.5 Connector", 
      desc: "Model endpoint failed to respond within 30s threshold", 
      time: "42 mins ago", 
      icon: <ShieldAlert className="text-red-500" />,
      bg: "bg-red-500/10"
    },
    { 
      type: "renew", 
      title: "Subscription Renewed: DataNexus", 
      desc: "Annual Pro subscription renewed successfully", 
      time: "1 hour ago", 
      icon: <ShieldCheck className="text-primary" />,
      bg: "bg-primary/10"
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Super Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Global platform performance, revenue analytics, and system oversight.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="bg-white dark:bg-slate-900 rounded-2xl font-bold h-12 border-slate-200 dark:border-white/5 dark:text-white px-6">System Health Details</Button>
           <Button className="bg-primary hover:bg-blue-600 text-white font-black rounded-2xl h-12 px-8 shadow-xl shadow-primary/20">
             Manage Infrastructure
           </Button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((stat, i) => (
          <Card key={i} className="p-8 bg-white dark:bg-slate-900 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-[2rem] group hover:scale-[1.02] transition-transform">
             <div className="flex items-center justify-between mb-8">
                <div className="h-12 w-12 bg-slate-50 dark:bg-black/30 rounded-2xl flex items-center justify-center font-bold">
                   {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-black italic px-2.5 py-1 rounded-lg ${
                   stat.trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'
                }`}>
                   {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {stat.change}
                </div>
             </div>
             <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
             <p className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Main Consumption Chart */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">API Consumption Trends</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Usage distribution across active AI models (Last 7 Days)</p>
               </div>
               <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                  {['7D', '30D', '90D'].map((t) => (
                     <button key={t} className={`px-4 py-1.5 text-xs font-black rounded-lg transition-all ${t === '7D' ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500'}`}>{t}</button>
                  ))}
               </div>
            </div>
            
            <Card className="p-10 bg-white dark:bg-slate-900 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-[2.5rem]">
               <div className="h-[400px] w-full flex items-end justify-between gap-4">
                  {/* High quality faked chart area */}
                  {[65, 80, 45, 90, 75, 55, 100, 85, 70, 95, 60, 88].map((v, i) => (
                     <div key={i} className="flex-grow group relative flex flex-col justify-end gap-1">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 whitespace-nowrap shadow-xl">
                           Day {i+1}: {(v * 10).toLocaleString()} reqs
                        </div>
                        {/* Multiple stacks for multi-pass visualization */}
                        <div className="w-full bg-blue-500/20 hover:bg-blue-500/40 transition-all rounded-t-sm" style={{ height: `${v * 0.4}%` }}></div>
                        <div className="w-full bg-primary/40 hover:bg-primary transition-all rounded-t-sm" style={{ height: `${v * 0.6}%` }}></div>
                     </div>
                  ))}
               </div>
               <div className="mt-10 pt-10 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">OpenAI (SGE-Pass)</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500/40"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Anthropic (Contextual)</span>
                     </div>
                  </div>
                  <Button variant="ghost" className="text-slate-400 font-bold hover:text-primary transition-all group">
                     Full Analytics Log <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
               </div>
            </Card>
         </div>

         {/* System Activity Feed */}
         <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight px-2">Recent System Activity</h3>
            <div className="space-y-4">
               {systemActivity.map((act, i) => (
                  <Card key={i} className="p-5 bg-white dark:bg-slate-900 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-[1.75rem] group cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                     <div className="flex gap-4">
                        <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center font-bold ${act.bg}`}>
                           {act.icon}
                        </div>
                        <div className="flex-grow space-y-1 pr-4">
                           <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black text-slate-900 dark:text-white leading-none">{act.title}</h4>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter shrink-0">{act.time}</span>
                           </div>
                           <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{act.desc}</p>
                           <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="link" className="text-[10px] font-black uppercase text-primary p-0 h-auto">Action Details</Button>
                              <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                              <Button variant="link" className="text-[10px] font-black uppercase text-slate-400 p-0 h-auto">Ignore</Button>
                           </div>
                        </div>
                     </div>
                  </Card>
               ))}
            </div>
            <Button className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 font-bold py-7 rounded-2xl shadow-sm">
               View Full Audit Log
               <Clock className="h-4 w-4 ml-2 opacity-50" />
            </Button>
         </div>
      </div>
    </div>
  );
}


