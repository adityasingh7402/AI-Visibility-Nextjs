'use client';

import { 
  User, 
  Users, 
  Key, 
  Bell, 
  CreditCard, 
  Shield, 
  Trash2, 
  Camera,
  AlertCircle,
  Mail,
  ChevronRight,
  ShieldCheck,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const tabs = [
    { label: "Profile", icon: <User size={18} />, active: true },
    { label: "Team", icon: <Users size={18} />, active: false },
    { label: "API Keys", icon: <Key size={18} />, active: false },
    { label: "Notifications", icon: <Bell size={18} />, active: false },
    { label: "Billing", icon: <CreditCard size={18} />, active: false },
    { label: "Security", icon: <Shield size={18} />, active: false },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Manage your identity, team access, and security preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
         {/* Internal Settings Nav */}
         <aside className="w-full lg:w-72 shrink-0 space-y-10">
            <div className="space-y-2">
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">Workspace</p>
               <div className="space-y-1">
                 {tabs.map((tab) => (
                    <button 
                       key={tab.label}
                       className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all group ${
                          tab.active 
                          ? "bg-primary text-white shadow-xl shadow-primary/20" 
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                       }`}
                    >
                       <div className="flex items-center gap-3">
                         {tab.icon}
                         <span>{tab.label}</span>
                       </div>
                       {!tab.active && <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-slate-300 dark:text-slate-600" />}
                    </button>
                 ))}
               </div>
            </div>

            {/* Plan Summary Card */}
            <div className="rounded-[2rem] bg-slate-900 dark:bg-white p-8 text-white dark:text-slate-900 space-y-6 shadow-2xl shadow-slate-200 dark:shadow-none relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
               
               <div className="flex items-center justify-between relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Active Plan</span>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
                  </div>
               </div>
               
               <div className="space-y-1">
                 <h4 className="text-xl font-black tracking-tighter uppercase italic">Agency Pro</h4>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                   Next billing cycle:<br/>
                   <span className="text-white dark:text-slate-900">October 12, 2024</span>
                 </p>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                     <span>GEO Reach Usage</span>
                     <span className="text-primary">70%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 dark:bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '70%' }}></div>
                  </div>
               </div>
               
               <Button variant="outline" className="w-full bg-transparent border-white/20 dark:border-slate-200 text-white dark:text-slate-900 font-black uppercase tracking-widest text-[9px] h-10 hover:bg-white/10 dark:hover:bg-slate-50 rounded-xl transition-all">
                  Manage Sub
               </Button>
            </div>
         </aside>

         {/* Content Area */}
         <div className="flex-grow space-y-12">
            {/* Personal Info Section */}
            <section className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Identity</h3>
                  <Button className="bg-primary hover:bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 rounded-xl h-10 px-6 active:scale-95 transition-all">Save Profile</Button>
               </div>
               
               <div className="bg-white dark:bg-slate-900/50 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 space-y-10 shadow-sm">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                     <div className="relative group">
                        <div className="p-1 rounded-[2.5rem] bg-gradient-to-tr from-primary to-blue-400 shadow-xl shadow-primary/10 group-hover:rotate-6 transition-transform">
                          <Avatar className="h-32 w-32 rounded-[2.2rem] border-4 border-white dark:border-slate-900">
                             <AvatarImage src="" />
                             <AvatarFallback className="bg-slate-50 dark:bg-black text-3xl font-black text-primary uppercase italic">AR</AvatarFallback>
                          </Avatar>
                        </div>
                        <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-2xl flex items-center justify-center text-white border-4 border-white dark:border-slate-900 shadow-xl group-hover:scale-110 transition-all active:scale-90">
                           <Camera size={18} />
                        </button>
                     </div>
                     <div className="text-center md:text-left space-y-2">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Profile Photo</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-[200px]">Update your avatar visible to team members and clients.</p>
                        <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                          <Button variant="outline" className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest px-4 dark:text-white border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">Upload Image</Button>
                          <Button variant="ghost" className="rounded-xl h-9 text-[10px] font-black uppercase tracking-widest px-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">Remove</Button>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">First Name</label>
                        <input defaultValue="Alex" 
                          className="w-full h-14 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-2xl px-6 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Last Name</label>
                        <input defaultValue="Rivers" 
                          className="w-full h-14 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-2xl px-6 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                     </div>
                     <div className="space-y-3 md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Primary Email</label>
                        <div className="relative group">
                           <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                           <input defaultValue="alex.rivers@enterprisehub.com" 
                            className="w-full h-14 pl-14 pr-6 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-2xl font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Security Section */}
            <section className="space-y-8 animate-in slide-in-from-right-4 duration-500 delay-150">
               <div className="flex items-center justify-between px-4">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Security</h3>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={18} />
                  </div>
               </div>
               
               <div className="bg-white dark:bg-slate-900/50 p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 space-y-10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Lock size={120} />
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-[2rem]">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Protection Protocol</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                        Password must be at least 12 characters including a number and special character. Multi-factor authentication is currently <span className="text-emerald-500 font-black">ENABLED</span>.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Current Password</label>
                        <input type="password" placeholder="••••••••••••" 
                          className="w-full h-14 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-2xl px-6 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">New Password</label>
                           <input type="password" placeholder="••••••••••••" 
                            className="w-full h-14 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-2xl px-6 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Confirm New Password</label>
                           <input type="password" placeholder="••••••••••••" 
                            className="w-full h-14 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-2xl px-6 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                     </div>
                  </div>
                  <div className="pt-4">
                     <Button className="rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black uppercase tracking-[0.15em] text-[10px] h-12 px-8 hover:opacity-90 transition-all active:scale-95">Update Credentials</Button>
                  </div>
               </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-8 animate-in slide-in-from-right-4 duration-500 delay-300">
               <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 p-8 md:p-12 rounded-[2.5rem] space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-red-500/10 transition-all"></div>
                  
                  <div className="flex items-center gap-4 text-red-500 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                       <Trash2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">Danger Zone</h3>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                     <div className="space-y-2">
                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Erase Account Identity</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm leading-relaxed">
                          Permanent deletion of your account and all associated GEO optimization data. This action is irreversible.
                        </p>
                     </div>
                     <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl h-14 px-10 shadow-2xl shadow-red-500/30 active:scale-95 transition-all">Terminate Account</Button>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
