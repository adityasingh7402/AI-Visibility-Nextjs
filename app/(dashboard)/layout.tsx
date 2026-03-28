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
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let systemRole = 'CUSTOMER';
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('system_role')
      .eq('id', user.id)
      .single();
    if (profile) systemRole = profile.system_role;
  }

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard", roles: ['CUSTOMER', 'SUPERADMIN'] },
    { label: "Keyword Discovery", icon: <Search size={20} />, href: "/dashboard/keywords", roles: ['CUSTOMER', 'SUPERADMIN'] },
    { label: "Content Validator", icon: <FileText size={20} />, href: "/dashboard/content", roles: ['CUSTOMER', 'SUPERADMIN'] },
    { label: "Visibility Progress", icon: <ChevronRight size={20} />, href: "/dashboard/progress", roles: ['CUSTOMER', 'SUPERADMIN'] },
    { label: "Clients", icon: <Users size={20} />, href: "/dashboard/clients", roles: ['SUPERADMIN'] },
    { label: "Run Analysis", icon: <Bolt size={20} />, href: "/dashboard/analysis", roles: ['CUSTOMER'] },
    { label: "Reports", icon: <FileText size={20} />, href: "/dashboard/reports", roles: ['CUSTOMER', 'SUPERADMIN'] },
    { label: "Billing", icon: <CreditCard size={20} />, href: "/dashboard/billing", roles: ['CUSTOMER'] },
    { label: "Settings", icon: <Settings size={20} />, href: "/dashboard/settings", roles: ['CUSTOMER', 'SUPERADMIN'] },
  ].filter(item => item.roles.includes(systemRole));

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-black font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5 flex flex-col hidden lg:flex">
        <div className="p-6 border-b border-slate-100 dark:border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm">G</div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">GEO Visibility</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1.5 mt-4">
          {navItems.map((item) => (
             <Link 
              key={item.label} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary transition-all font-semibold group"
             >
               <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
               <span className="text-sm">{item.label}</span>
             </Link>
          ))}
        </nav>

        <div className="p-6">
           <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-5 rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 shrink-0">
                    {user?.user_metadata?.full_name ? user.user_metadata.full_name.substring(0, 2).toUpperCase() : 'U'}
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                       {user?.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">
                       {user?.email || 'user@example.com'}
                    </p>
                 </div>
              </div>
              <form action={async () => {
                 'use server';
                 const { createClient } = await import('@/utils/supabase/server');
                 const { redirect } = await import('next/navigation');
                 const supabase = await createClient();
                 await supabase.auth.signOut();
                 redirect('/login');
              }}>
                 <Button type="submit" variant="ghost" className="w-full text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold h-10 rounded-xl justify-start px-3 gap-3">
                    <LogOut size={16} />
                    Sign Out
                 </Button>
              </form>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden bg-slate-50/50 dark:bg-black">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 px-8 flex items-center justify-between shrink-0 z-20">
           <div className="flex items-center gap-4 max-w-xl w-full">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search projects, analyses, or clients..." 
                  className="pl-10 h-11 bg-slate-50 dark:bg-white/5 border-none rounded-xl text-sm"
                />
              </div>
           </div>

           <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="rounded-xl relative">
                <Bell className="h-5 w-5 text-slate-500" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
             </Button>
             <div className="h-8 w-[1px] bg-slate-100 dark:bg-white/5 mx-2"></div>
             <Button className="bg-primary hover:bg-blue-600 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20 transition-all active:scale-95">
               <Bolt className="h-4 w-4 mr-2" />
               Quick Analysis
             </Button>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-grow overflow-y-auto px-6 py-8 md:px-10 md:py-12">
           <div className="max-w-7xl mx-auto">
              {children}
           </div>
        </div>
      </main>
    </div>
  );
}
