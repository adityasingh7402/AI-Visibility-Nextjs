import { 
  TrendingDown, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Globe,
  PieChart,
  Calendar,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Revenue & Subscriptions | Admin",
};

export default function AdminRevenuePage() {
  const topMetrics = [
    { label: "MRR", value: "$142,500", change: "+4.2%", trend: "up", icon: <DollarSign className="text-primary" /> },
    { label: "Churn Rate", value: "1.2%", change: "-0.3%", trend: "up", icon: <TrendingDown className="text-red-500" /> },
    { label: "ARPU", value: "$115", change: "+$12", trend: "up", icon: <Users className="text-blue-500" /> },
  ];

  const transactions = [
    { customer: "Horizon Creative", email: "billing@horizon.co", amount: "$2,400.00", date: "Oct 24, 2023", plan: "Enterprise", status: "Success" },
    { customer: "Marcus Sterling", email: "marcus@dev.io", amount: "$299.00", date: "Oct 23, 2023", plan: "Pro", status: "Success" },
    { customer: "Elena Rossi", email: "e.rossi@ux.net", amount: "$99.00", date: "Oct 22, 2023", plan: "Starter", status: "Pending" },
    { customer: "Acme Corp", email: "finance@acme.com", amount: "$4,800.00", date: "Oct 21, 2023", plan: "Enterprise", status: "Success" },
    { customer: "TechFlow Solutions", email: "admin@techflow.io", amount: "$2,400.00", date: "Oct 20, 2023", plan: "Enterprise", status: "Success" },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Revenue & Subscriptions</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Track your platform growth, unit economics, and billing health.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="bg-white dark:bg-slate-900 rounded-xl font-bold h-11 border-slate-200 dark:border-white/5 dark:text-white px-5">
              <Download className="h-4 w-4 mr-2" />
              Financial Report
           </Button>
           <Button className="bg-primary hover:bg-blue-600 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
             Subscription Settings
           </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topMetrics.map((stat, i) => (
          <Card key={i} className="p-8 bg-white dark:bg-slate-900 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden relative">
             <div className="flex items-center justify-between relative z-10">
                <div className="h-12 w-12 bg-slate-50 dark:bg-black/20 rounded-2xl flex items-center justify-center font-bold">
                   {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-black italic px-2 py-1 rounded-lg ${
                   stat.trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'
                }`}>
                   {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {stat.change}
                </div>
             </div>
             <div className="mt-8 relative z-10">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</p>
             </div>
             {/* Subtle background chart line visually indicating trend */}
             <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 20" className="w-full h-full fill-primary">
                   <path d="M0,20 L10,15 L20,17 L30,12 L40,14 L50,8 L60,10 L70,5 L80,7 L90,2 L100,20 Z" />
                </svg>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Subscription Growth Chart */}
         <div className="lg:col-span-2 space-y-6">
            <Card className="p-10 bg-white dark:bg-slate-900 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem]">
               <div className="flex items-center justify-between mb-10">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-white">Subscription Growth</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">New vs Churned Subscriptions (6 Months)</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">New</span>
                     </div>
                     <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg">
                        <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Churned</span>
                     </div>
                  </div>
               </div>
               
               <div className="h-[350px] w-full flex items-end justify-between px-4 pb-8">
                  {[
                     { m: 'May', n: 40, c: 5, nClass: 'h-[40%]', cClass: 'h-[5%]' },
                     { m: 'Jun', n: 55, c: 8, nClass: 'h-[55%]', cClass: 'h-[8%]' },
                     { m: 'Jul', n: 45, c: 6, nClass: 'h-[45%]', cClass: 'h-[6%]' },
                     { m: 'Aug', n: 70, c: 10, nClass: 'h-[70%]', cClass: 'h-[10%]' },
                     { m: 'Sep', n: 85, c: 7, nClass: 'h-[85%]', cClass: 'h-[7%]' },
                     { m: 'Oct', n: 95, c: 4, nClass: 'h-[95%]', cClass: 'h-[4%]' }
                  ].map((d, i) => (
                     <div key={i} className="flex-grow flex flex-col items-center gap-2 group relative">
                        <div className="w-full max-w-[40px] flex items-end gap-1">
                           <div className={`flex-grow bg-primary/20 hover:bg-primary transition-all rounded-t-sm ${d.nClass}`}></div>
                           <div className={`w-2 bg-slate-200 dark:bg-slate-800 rounded-t-sm ${d.cClass}`}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{d.m}</span>
                     </div>
                  ))}
               </div>
            </Card>

            {/* Geographic Revenue Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="p-6 bg-slate-900 text-white rounded-3xl border-none shadow-xl flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Globe size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold">Global Presence</h4>
                        <p className="text-xs text-slate-400 font-medium">Revenue by region</p>
                     </div>
                  </div>
                  <ArrowUpRight className="text-slate-600 group-hover:text-primary transition-colors" />
               </Card>
               <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 shadow-sm rounded-3xl flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-black/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <PieChart size={24} />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Plan Mix</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Starter vs Pro vs Enterprise</p>
                     </div>
                  </div>
                  <ArrowUpRight className="text-slate-200 group-hover:text-primary transition-colors" />
               </Card>
            </div>
         </div>

         {/* Transactions List */}
         <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recent Transactions</h3>
               <Button variant="link" className="text-primary font-bold p-0 h-auto">View All</Button>
            </div>
            <div className="space-y-4">
               {transactions.map((tx, i) => (
                  <Card key={i} className="p-5 bg-white dark:bg-slate-900 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.75rem] group cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-slate-50 dark:bg-black/20 rounded-xl flex items-center justify-center text-slate-400">
                              <CreditCard size={18} />
                           </div>
                           <div>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white leading-none">{tx.customer}</h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-1.5 lowercase truncate max-w-[120px]">{tx.email}</p>
                           </div>
                        </div>
                        <Badge variant="outline" className="border-slate-100 dark:border-white/10 text-slate-500 font-black text-[9px] uppercase tracking-tighter px-1.5 rounded-md">
                           {tx.plan}
                        </Badge>
                     </div>
                     <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx.date}</span>
                           <span className="text-sm font-black text-slate-900 dark:text-white">{tx.amount}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{tx.status}</span>
                        </div>
                     </div>
                  </Card>
               ))}
            </div>
            <Button className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 font-bold py-7 rounded-2xl shadow-sm">
               <Calendar className="h-4 w-4 mr-2" />
               View Monthly Summary
            </Button>
         </div>
      </div>
    </div>
  );
}
