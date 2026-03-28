'use client';

import { 
  CreditCard, 
  Download, 
  HelpCircle, 
  ChevronRight,
  ShieldCheck,
  History,
  ExternalLink,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function BillingPage() {
  const invoices = [
    { id: "INV-2023-001", date: "Oct 12, 2023", amount: "$299.00", status: "Paid" },
    { id: "INV-2023-002", date: "Sep 12, 2023", amount: "$299.00", status: "Paid" },
    { id: "INV-2023-003", date: "Aug 12, 2023", amount: "$299.00", status: "Paid" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Billing & Subscriptions</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Manage your agency plan, credits, and view payment history.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 h-12 flex items-center gap-2 font-black uppercase tracking-widest text-[10px]">
             <Download size={16} />
             Export All
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Main Plan Card */}
          <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 md:p-10 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-40 -mt-40 blur-[100px]"></div>
             
             <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3">
                         <span className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg">Current Plan</span>
                         <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Pro Agency Plan</h3>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Your plan renews on <span className="text-slate-900 dark:text-white font-black underline underline-offset-4 decoration-primary/30">Nov 12, 2023</span></p>
                   </div>
                   <Button size="lg" className="bg-primary hover:bg-blue-600 text-white font-black rounded-2xl h-16 px-10 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                     Upgrade Plan
                   </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="space-y-3">
                         <div className="flex items-center justify-between mb-1">
                            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Token Usage</h4>
                            <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">7,500 / 10,000</span>
                         </div>
                         <div className="h-4 bg-slate-100 dark:bg-black/40 rounded-full overflow-hidden p-1 border border-slate-200/50 dark:border-white/5">
                            <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '75%' }}></div>
                         </div>
                         <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider px-1">Total GEO optimization capacity</p>
                      </div>
                      <div className="p-5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-3xl flex items-center gap-4">
                         <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <ShieldCheck size={20} />
                         </div>
                         <p className="text-xs text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-tight leading-snug">75% capacity used.<br/><span className="opacity-60 text-[10px]">Auto-refill is active.</span></p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-4">
                         <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Primary Payment Method</h4>
                         <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-black/40 rounded-[2rem] border border-slate-200 dark:border-white/10 hover:border-primary/30 transition-all cursor-pointer group">
                            <div className="flex items-center gap-5">
                               <div className="h-12 w-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                                  <CreditCard size={24} className="text-slate-400 group-hover:text-primary transition-colors" />
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Visa ending in 4242</p>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-widest mt-0.5">Expires 12/26</p>
                               </div>
                            </div>
                            <Button variant="ghost" className="text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary/5 rounded-xl px-4 h-9">Edit</Button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Invoice History */}
          <section className="space-y-6">
             <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <History size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Payment Records</h3>
             </div>
             
             <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/20">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Transaction ID</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Amount</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Invoice</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                         {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                               <td className="px-10 py-7 font-black text-slate-900 dark:text-white tracking-tight">{invoice.id}</td>
                               <td className="px-10 py-7 text-xs text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">{invoice.date}</td>
                               <td className="px-10 py-7 text-sm font-black text-slate-900 dark:text-white">{invoice.amount}</td>
                               <td className="px-10 py-7">
                                  <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-emerald-500/10">
                                     {invoice.status}
                                  </span>
                               </td>
                               <td className="px-10 py-7 text-right">
                                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-2xl border-slate-200 dark:border-white/10 hover:text-primary transition-all group-hover:bg-white dark:group-hover:bg-slate-800">
                                     <Download size={16} />
                                  </Button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="p-8 text-center border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-black/10">
                   <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-2xl h-12 px-8 uppercase tracking-widest text-[10px]">
                      View Full Archive History <ChevronRight className="ml-2 h-4 w-4" />
                   </Button>
                </div>
             </div>
          </section>
        </div>

        {/* Support Sidebar */}
        <div className="space-y-8">
           <div className="p-10 rounded-[2.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl shadow-slate-200 dark:shadow-none space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 dark:bg-primary/10 rounded-full -mr-16 -mt-16"></div>
              
              <div className="h-16 w-16 rounded-[2rem] bg-white/10 dark:bg-slate-900/10 flex items-center justify-center text-white dark:text-slate-900 border border-white/20 dark:border-slate-900/20">
                 <HelpCircle size={32} />
              </div>
              <div className="space-y-3">
                 <h3 className="text-2xl font-black tracking-tighter">Billing Help?</h3>
                 <p className="text-sm font-medium leading-relaxed opacity-70">
                    Our support team is available 24/7 for plan migrations, custom enterprise setups, or payment assistance.
                 </p>
              </div>
              <div className="space-y-4 pt-4">
                 <Button className="w-full bg-primary hover:bg-blue-600 text-white font-black h-14 rounded-2xl shadow-xl shadow-primary/30">
                    Contact Support
                 </Button>
                 <Button variant="ghost" className="w-full text-white dark:text-slate-900 focus:opacity-100 opacity-60 hover:opacity-100 font-black h-14 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                    Billing FAQ
                    <ExternalLink size={14} />
                 </Button>
              </div>
           </div>

           <div className="p-10 rounded-[2.5rem] bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Save 20% Today</p>
                <div className="h-8 w-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <ChevronUp size={16} />
                </div>
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Annual Pro Plan</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Switch to annual billing and save <span className="text-emerald-500 font-black px-1.5 py-0.5 rounded-lg bg-emerald-500/10">$717</span> per year.
              </p>
              <Button variant="link" className="text-emerald-600 dark:text-emerald-400 font-black p-0 h-auto text-[10px] mt-4 uppercase tracking-[0.15em] hover:no-underline group">
                Apply Offer <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
