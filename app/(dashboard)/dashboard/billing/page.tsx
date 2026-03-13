import { 
  CreditCard, 
  Download, 
  Plus, 
  HelpCircle, 
  ChevronRight,
  ShieldCheck,
  History,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const metadata = {
  title: "Billing | GEO Platform",
};

export default function BillingPage() {
  const invoices = [
    { id: "INV-2023-001", date: "Oct 12, 2023", amount: "$299.00", status: "Paid" },
    { id: "INV-2023-002", date: "Sep 12, 2023", amount: "$299.00", status: "Paid" },
    { id: "INV-2023-003", date: "Aug 12, 2023", amount: "$299.00", status: "Paid" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Billing & Subscriptions</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your agency plan, credits, and view payment history.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="bg-white dark:bg-slate-900 rounded-xl font-bold h-11 border-slate-200 dark:border-white/5 dark:text-white">
             Download All
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Plan Card */}
          <Card className="p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2.5rem] overflow-hidden relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
             
             <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md">Current Plan</span>
                         <h3 className="text-2xl font-black text-slate-900 dark:text-white">Pro Agency Plan</h3>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Your plan renews on <span className="text-slate-900 dark:text-white font-bold">Nov 12, 2023</span></p>
                   </div>
                   <Button size="lg" className="bg-primary hover:bg-blue-600 text-white font-black rounded-2xl h-14 px-8 shadow-xl shadow-primary/20">
                     Upgrade Plan
                   </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <div className="flex items-center justify-between mb-1">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Credit Usage</h4>
                            <span className="text-sm font-black text-slate-900 dark:text-white">7,500 / 10,000</span>
                         </div>
                         <Progress value={75} className="h-3 bg-slate-100 dark:bg-white/5" />
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Generative engine optimization tokens</p>
                      </div>
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                         <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                         <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold italic">75% capacity used. Auto-refill is active.</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-3">
                         <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Payment Method</h4>
                         <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-4">
                               <div className="h-10 w-14 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center">
                                  <CreditCard size={20} className="text-slate-400" />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white">Visa ending in 4242</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Expires 12/26</p>
                               </div>
                            </div>
                            <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl text-xs px-3">Change</Button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </Card>

          {/* Invoice History */}
          <section className="space-y-6">
             <div className="flex items-center gap-2">
                <History className="text-primary" size={20} />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Invoice History</h3>
             </div>
             <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2rem] overflow-hidden">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                         <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Invoice ID</th>
                         <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                         <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                         <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                         <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Receipt</th>
                      </tr>
                   </thead>
                   <tbody>
                      {invoices.map((invoice, i) => (
                         <tr key={invoice.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                            <td className="px-8 py-5 font-bold text-slate-900 dark:text-white">{invoice.id}</td>
                            <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400 font-medium">{invoice.date}</td>
                            <td className="px-8 py-5 text-sm font-black text-slate-900 dark:text-white">{invoice.amount}</td>
                            <td className="px-8 py-5">
                               <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                                  {invoice.status}
                               </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:text-primary transition-all group-hover:bg-white dark:group-hover:bg-slate-800">
                                  <Download size={16} />
                               </Button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
                <div className="p-6 text-center border-t border-slate-100 dark:border-white/5">
                   <Button variant="link" className="text-primary font-bold">View all billing history</Button>
                </div>
             </Card>
          </section>
        </div>

        {/* Support Sidebar */}
        <div className="space-y-6">
           <Card className="p-8 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2.5rem] space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                 <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Need help with billing?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                 Our billing support team is available 24/7 to help with plan migrations, payment issues, or custom enterprise requirements.
              </p>
              <div className="space-y-3 pt-4">
                 <Button className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-slate-800 dark:hover:bg-slate-100 font-black h-12 rounded-xl">
                    Contact Support
                 </Button>
                 <Button variant="ghost" className="w-full text-primary font-bold h-12 rounded-xl flex items-center justify-center gap-2">
                    Billing FAQ
                    <ExternalLink size={14} />
                 </Button>
              </div>
           </Card>

           <div className="px-8 py-6 bg-primary/5 border border-primary/10 rounded-3xl space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Special Offer</p>
              <h4 className="font-bold text-slate-900 dark:text-white">Annual Pro Plan</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Switch to annual billing and save <span className="text-emerald-500 font-black">20% ($717)</span> per year.</p>
              <Button variant="link" className="text-primary font-bold p-0 h-auto text-xs mt-2">Switch Offer <ChevronRight size={14} className="ml-1" /></Button>
           </div>
        </div>
      </div>
    </div>
  );
}
