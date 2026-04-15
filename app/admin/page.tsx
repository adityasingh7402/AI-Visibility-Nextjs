import { 
  TrendingUp, 
  Users, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Clock,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Super Admin | GEO SaaS",
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // 1. Fetch active users count
  const { count: activeUsersCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  // 2. Fetch Organizations count (as proxy for MRR/Subscriptions for now)
  const { count: orgCount } = await supabase
    .from('organizations')
    .select('*', { count: 'exact', head: true });

  // 3. Fetch Recent System Activity from Audit Logs
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select(`
      id,
      action,
      action_context,
      created_at,
      user:actor_id ( email, name )
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  const metrics = [
    { label: "Total Organizations", value: orgCount || 0, change: "+14.2%", trend: "up", icon: <CreditCard className="text-primary" /> },
    { label: "Active Users", value: activeUsersCount || 0, change: "+8.1%", trend: "up", icon: <Users className="text-blue-500" /> },
    { label: "Total API Calls Today", value: "892,104", change: "-2.4%", trend: "down", icon: <Zap className="text-amber-500" /> },
    { label: "System Error Rate", value: "0.04%", change: "-0.01%", trend: "up", icon: <Activity className="text-emerald-500" /> },
  ];

  // Map audit logs to a safe UI format
  const systemActivity = (auditLogs || []).map((log) => {
    let icon = <Activity className="text-blue-500" />;
    let bg = "bg-blue-500/10";
    
    if (log.action.includes('CREATE')) {
      icon = <Plus className="text-emerald-500" />;
      bg = "bg-emerald-500/10";
    } else if (log.action.includes('UPDATE')) {
      icon = <TrendingUp className="text-amber-500" />;
      bg = "bg-amber-500/10";
    } else if (log.action.includes('LOGIN')) {
       icon = <ShieldCheck className="text-primary" />;
       bg = "bg-primary/10";
    }

    const userObj = Array.isArray(log.user) ? log.user[0] : log.user;
    
    return {
      type: log.action,
      title: `${log.action} Event`,
      desc: userObj?.email || "System User",
      time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon,
      bg
    };
  });

  // Fallback if no logs exist yet
  if (systemActivity.length === 0) {
    systemActivity.push({
      type: "system",
      title: "System Initialized",
      desc: "Waiting for user activity...",
      time: "Just now",
      icon: <ShieldCheck className="text-primary" />,
      bg: "bg-primary/10"
    });
  }

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
                  {[
                     { v: 65, h1: 'h-[26%]', h2: 'h-[39%]' },
                     { v: 80, h1: 'h-[32%]', h2: 'h-[48%]' },
                     { v: 45, h1: 'h-[18%]', h2: 'h-[27%]' },
                     { v: 90, h1: 'h-[36%]', h2: 'h-[54%]' },
                     { v: 75, h1: 'h-[30%]', h2: 'h-[45%]' },
                     { v: 55, h1: 'h-[22%]', h2: 'h-[33%]' },
                     { v: 100, h1: 'h-[40%]', h2: 'h-[60%]' },
                     { v: 85, h1: 'h-[34%]', h2: 'h-[51%]' },
                     { v: 70, h1: 'h-[28%]', h2: 'h-[42%]' },
                     { v: 95, h1: 'h-[38%]', h2: 'h-[57%]' },
                     { v: 60, h1: 'h-[24%]', h2: 'h-[36%]' },
                     { v: 88, h1: 'h-[35%]', h2: 'h-[53%]' },
                  ].map((bar, i) => (
                     <div key={i} className="flex-grow group relative flex flex-col justify-end gap-1">
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 whitespace-nowrap shadow-xl">
                           Day {i+1}: {(bar.v * 10).toLocaleString()} reqs
                        </div>
                        {/* Multiple stacks for multi-pass visualization */}
                        <div className={`w-full bg-blue-500/20 hover:bg-blue-500/40 transition-all rounded-t-sm ${bar.h1}`}></div>
                        <div className={`w-full bg-primary/40 hover:bg-primary transition-all rounded-t-sm ${bar.h2}`}></div>
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


