import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  FolderRoot, 
  Bolt, 
  FileText, 
  CreditCard, 
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { label: "Clients", icon: <Users size={20} />, href: "/dashboard/clients" },
    { label: "Projects", icon: <FolderRoot size={20} />, href: "/dashboard/projects" },
    { label: "Run Analysis", icon: <Bolt size={20} />, href: "/dashboard/analysis" },
    { label: "Reports", icon: <FileText size={20} />, href: "/dashboard/reports" },
    { label: "Billing", icon: <CreditCard size={20} />, href: "/dashboard/billing" },
    { label: "Settings", icon: <Settings size={20} />, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-100 dark:border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm">G</div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">GEO</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-2 mt-4">
          {navItems.map((item) => (
             <Link 
              key={item.label} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary transition-all font-semibold"
             >
               {item.icon}
               <span>{item.label}</span>
             </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-white/5">
           <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">AR</div>
                 <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Alex Rivers</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Marketing Director</p>
                 </div>
              </div>
              <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 px-8 flex items-center justify-between shrink-0">
           <div className="flex items-center gap-4 max-w-xl w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search projects, analyses, or clients..." 
                  className="pl-10 h-11 bg-slate-50 dark:bg-white/5 border-none rounded-xl"
                />
              </div>
           </div>

           <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="rounded-xl relative">
                <Bell className="h-5 w-5 text-slate-500" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
             </Button>
             <div className="h-8 w-[1px] bg-slate-100 dark:bg-white/5 mx-2"></div>
             <Button className="bg-primary hover:bg-blue-600 text-white font-bold rounded-xl h-11 px-6">
               <Bolt className="h-4 w-4 mr-2" />
               Quick Analysis
             </Button>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-grow overflow-y-auto p-8 bg-slate-50 dark:bg-black/40">
           {children}
        </div>
      </main>
    </div>
  );
}
