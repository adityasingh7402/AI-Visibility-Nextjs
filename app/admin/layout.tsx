import Link from "next/link";
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Cpu, 
  Activity, 
  Settings,
  Bell,
  Search,
  LogOut,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminNavItems = [
    { label: "Overview", icon: <BarChart3 size={20} />, href: "/admin" },
    { label: "Users", icon: <Users size={20} />, href: "/admin/users" },
    { label: "Subscriptions", icon: <CreditCard size={20} />, href: "/admin/revenue" },
    { label: "AI Models", icon: <Cpu size={20} />, href: "/admin/models" },
    { label: "System Health", icon: <Activity size={20} />, href: "/admin/health" },
    { label: "Settings", icon: <Settings size={20} />, href: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-black font-sans">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-slate-900 border-r border-white/5 flex flex-col hidden lg:flex">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">G</div>
            <div className="flex flex-col">
               <span className="text-xl font-black text-white tracking-tighter leading-none">GEO SaaS</span>
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Super Admin</span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4 text-slate-400">
           <p className="text-[10px] font-black uppercase tracking-widest px-4 mb-4 text-slate-500">Main Menu</p>
          {adminNavItems.map((item) => (
             <Link 
              key={item.label} 
              href={item.href}
              className="group flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-white/5 hover:text-white transition-all font-bold"
             >
               <div className="flex items-center gap-3">
                  <div className="text-slate-500 group-hover:text-primary transition-colors">
                     {item.icon}
                  </div>
                  <span className="text-[15px]">{item.label}</span>
               </div>
               {item.label === "System Health" && (
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               )}
             </Link>
          ))}
        </nav>

        <div className="p-6">
           <div className="bg-white/5 border border-white/5 p-5 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">A</div>
                 <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">Admin User</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">admin@geosaas.ai</p>
                 </div>
              </div>
              <Button variant="ghost" className="w-full text-slate-400 hover:text-red-500 hover:bg-red-500/10 font-bold h-10 rounded-xl justify-start px-3 gap-3">
                 <LogOut size={16} />
                 Sign Out
              </Button>
           </div>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden bg-slate-50/50 dark:bg-black/50">
        {/* Admin Header */}
        <header className="h-24 px-10 flex items-center justify-between shrink-0 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-black/80 backdrop-blur-xl sticky top-0 z-50">
           <div className="flex items-center gap-6 max-w-2xl w-full">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Global search across users, transactions, and logs..." 
                  className="pl-12 h-12 bg-slate-50 dark:bg-white/5 border-none rounded-2xl font-medium focus-visible:ring-primary/20"
                />
              </div>
           </div>

           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Online</span>
             </div>
             <div className="h-8 w-[1px] bg-slate-100 dark:bg-white/5 mx-2"></div>
             <Button variant="ghost" size="icon" className="rounded-xl relative h-12 w-12 hover:bg-slate-100 dark:hover:bg-white/5">
                <Bell size={20} className="text-slate-500" />
                <span className="absolute top-3 right-3 h-2.5 w-2.5 bg-primary rounded-full border-2 border-white dark:border-black"></span>
             </Button>
           </div>
        </header>

        {/* Admin Page Content */}
        <div className="flex-grow overflow-y-auto p-10">
           {children}
        </div>
      </main>
    </div>
  );
}
