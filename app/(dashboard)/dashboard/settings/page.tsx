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
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata = {
  title: "Settings | GEO Platform",
};

export default function SettingsPage() {
  const tabs = [
    { label: "Profile", icon: <User size={18} />, active: true },
    { label: "Team", icon: <Users size={18} />, active: false },
    { label: "API Keys", icon: <Key size={18} />, active: false },
    { label: "Notifications", icon: <Bell size={18} />, active: false },
    { label: "Billing & Subscription", icon: <CreditCard size={18} />, active: false },
    { label: "Privacy & Security", icon: <Shield size={18} />, active: false },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your identity and public information across the GEO platform.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
         {/* Internal Settings Nav */}
         <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Account Settings</p>
               {tabs.slice(0, 4).map((tab) => (
                  <button 
                     key={tab.label}
                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                        tab.active 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                     }`}
                  >
                     {tab.icon}
                     <span className="text-sm">{tab.label}</span>
                  </button>
               ))}
            </div>

            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Platform</p>
               {tabs.slice(4).map((tab) => (
                  <button 
                     key={tab.label}
                     className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                  >
                     {tab.icon}
                     <span className="text-sm">{tab.label}</span>
                  </button>
               ))}
            </div>

            {/* Plan Summary Card */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pro Plan</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
               </div>
               <p className="text-xs text-slate-400 font-medium">Next billing date: <span className="text-white font-bold">Oct 12, 2024</span></p>
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <span>Tokens Used</span>
                     <span className="text-white">8.4k / 12k</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-primary" style={{ width: '70%' }}></div>
                  </div>
               </div>
               <Button variant="outline" className="w-full bg-transparent border-white/10 text-white font-bold hover:bg-white/5 rounded-xl text-xs h-10">
                  Manage Subscription
               </Button>
            </div>
         </aside>

         {/* Content Area */}
         <div className="flex-grow space-y-12">
            {/* Personal Info Section */}
            <section className="space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Personal Information</h3>
                  <Button className="bg-primary hover:bg-blue-600 text-white font-bold shadow-lg shadow-primary/20 rounded-xl">Save Changes</Button>
               </div>
               
               <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 space-y-8">
                  <div className="flex items-center gap-6">
                     <div className="relative group">
                        <Avatar className="h-24 w-24 border-4 border-slate-50 dark:border-black shadow-xl">
                           <AvatarImage src="" />
                           <AvatarFallback className="bg-slate-100 dark:bg-black text-2xl font-black text-primary">AR</AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
                           <Camera size={14} />
                        </button>
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">Profile Photo</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">PNG or JPG, max 5MB</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">First Name</label>
                        <Input defaultValue="Alex" className="h-12 bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 rounded-xl font-medium" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                        <Input defaultValue="Rivers" className="h-12 bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 rounded-xl font-medium" />
                     </div>
                     <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                        <div className="relative">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                           <Input defaultValue="alex.rivers@enterprisehub.com" className="pl-11 h-12 bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 rounded-xl font-medium" />
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Security Section */}
            <section className="space-y-6">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">Security</h3>
               <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 space-y-6">
                  <Alert className="bg-blue-500/5 border-blue-500/10 text-primary rounded-2xl p-4">
                     <AlertCircle className="h-4 w-4" />
                     <AlertTitle className="font-bold text-sm ml-2">Password Policy</AlertTitle>
                     <AlertDescription className="text-xs font-medium ml-2">
                        Password must be at least 12 characters including a number and special character.
                     </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Current Password</label>
                        <Input type="password" placeholder="••••••••••••" className="h-12 bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 rounded-xl" />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 dark:text-slate-300">New Password</label>
                           <Input type="password" placeholder="••••••••••••" className="h-12 bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
                           <Input type="password" placeholder="••••••••••••" className="h-12 bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 rounded-xl" />
                        </div>
                     </div>
                  </div>
                  <div className="pt-4">
                     <Button variant="outline" className="rounded-xl border-slate-200 dark:border-white/10 font-bold dark:text-white px-6">Update Password</Button>
                  </div>
               </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-6">
               <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] space-y-6">
                  <div className="flex items-center gap-3 text-red-500">
                     <Trash2 className="h-6 w-6" />
                     <h3 className="text-xl font-bold">Danger Zone</h3>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div>
                        <p className="font-bold text-slate-900 dark:text-white">Delete Account</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">Once you delete your account, there is no going back. Please be certain.</p>
                     </div>
                     <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl h-12 px-8">Delete Account</Button>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
}
