import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronRight, 
  UserPlus, 
  Mail, 
  Shield, 
  ArrowUpDown,
  Download,
  Users as UsersIcon,
  Zap,
  MousePointer2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata = {
  title: "User Management | Admin",
};

export default function UserManagementPage() {
  const users = [
    { name: "Jane Doe", email: "jane.doe@example.com", plan: "Enterprise", joined: "Oct 12, 2023", status: "Active" },
    { name: "Marcus Chen", email: "m.chen@agency.io", plan: "Enterprise", joined: "Dec 01, 2023", status: "Active" },
    { name: "Sarah K.", email: "sarah@studio.com", plan: "Pro", joined: "Jan 15, 2024", status: "Inactive" },
    { name: "Lena Meyer", email: "lena@global.de", plan: "Starter", joined: "Feb 02, 2024", status: "Active" },
    { name: "David Ross", email: "david@ross.co", plan: "Pro", joined: "Feb 10, 2024", status: "Active" },
    { name: "Emma Wilson", email: "emma@wilson.com", plan: "Enterprise", joined: "Feb 15, 2024", status: "Active" },
  ];

  const summaryStats = [
    { label: "Total Users", value: "2,451", icon: <UsersIcon size={18} /> },
    { label: "Active Now", value: "1,822", icon: <MousePointer2 size={18} /> },
    { label: "Avg Credits", value: "3.4k", icon: <Zap size={18} /> },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage platform access, roles, and credit allocation for all users.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="bg-white dark:bg-slate-900 rounded-xl font-bold h-11 border-slate-200 dark:border-white/5 dark:text-white px-5">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
           </Button>
           <Button className="bg-primary hover:bg-blue-600 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
             <UserPlus className="h-4 w-4 mr-2" />
             Create User
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Stats Sidebar/Top */}
         <div className="lg:col-span-1 space-y-6">
            {summaryStats.map((stat, i) => (
               <Card key={i} className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 shadow-sm rounded-3xl">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 bg-slate-50 dark:bg-black/20 rounded-xl flex items-center justify-center text-slate-500">
                        {stat.icon}
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{stat.value}</p>
                     </div>
                  </div>
               </Card>
            ))}

            <Card className="p-8 bg-slate-900 text-white rounded-[2rem] space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Shield size={80} />
               </div>
               <h3 className="text-lg font-bold relative z-10 font-black">Security Audit</h3>
               <p className="text-xs text-slate-400 font-medium relative z-10 leading-relaxed">
                  Run a platform-wide security audit to identify compromised accounts or unusual access patterns.
               </p>
               <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black h-11 rounded-xl relative z-10">
                  Run Platform Audit
               </Button>
            </Card>
         </div>

         {/* Main User List */}
         <div className="lg:col-span-3 space-y-6">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2.5rem] overflow-hidden">
               <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative max-w-sm w-full">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                     <Input 
                        placeholder="Search by name, email, or company..." 
                        className="pl-12 h-11 bg-slate-50 dark:bg-black/20 border-none rounded-xl font-medium"
                     />
                  </div>
                  <div className="flex items-center gap-3">
                     <Button variant="outline" className="rounded-xl border-slate-200 dark:border-white/10 dark:text-white h-11 font-bold">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                     </Button>
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                              <button className="flex items-center gap-2 hover:text-slate-600 transition-colors uppercase">
                                 User Info <ArrowUpDown className="h-3 w-3" />
                              </button>
                           </th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Plan</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Joined</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                           <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                        {users.map((user, i) => (
                           <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-sm">
                                       <AvatarFallback className="bg-slate-100 dark:bg-black text-xs font-black text-primary">
                                          {user.name.split(' ').map(n=>n[0]).join('')}
                                       </AvatarFallback>
                                    </Avatar>
                                    <div>
                                       <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{user.name}</p>
                                       <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium lowercase">
                                          <Mail size={12} className="opacity-50" />
                                          {user.email}
                                       </div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-5">
                                 <Badge className={`rounded-lg px-2 py-1 font-black uppercase text-[9px] tracking-widest ${
                                    user.plan === "Enterprise" ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                                 }`}>
                                    {user.plan}
                                 </Badge>
                              </td>
                              <td className="px-8 py-5">
                                 <span className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">{user.joined}</span>
                              </td>
                              <td className="px-8 py-5">
                                 <div className="flex items-center gap-2">
                                    <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                                       {user.status}
                                    </span>
                                 </div>
                              </td>
                              <td className="px-8 py-5 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-primary"><MoreHorizontal size={18} /></Button>
                                    <ChevronRight size={18} className="text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="p-6 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest px-2">Showing 1 to 10 of 2,451 results</p>
                  <div className="flex gap-2">
                     <Button variant="outline" size="sm" disabled className="rounded-xl h-9 px-4 font-bold border-slate-200 dark:border-white/10">Prev</Button>
                     {[1, 2, 3, '...', 245].map((p, i) => (
                        <Button key={i} variant={p === 1 ? 'default' : 'ghost'} size="sm" className={`h-9 w-9 rounded-xl font-bold ${p === 1 ? 'bg-primary' : 'text-slate-500'}`}>
                           {p}
                        </Button>
                     ))}
                     <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 font-bold border-slate-200 dark:border-white/10 dark:text-white">Next</Button>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
