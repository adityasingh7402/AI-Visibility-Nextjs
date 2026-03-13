import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Create Account | GEO Platform",
  description: "Join 5,000+ B2B marketing professionals using GEO to dominate AI-driven search results.",
};

export default function SignupPage() {
  const benefits = [
    {
      title: "Analyze",
      description: "Deep crawl of your visibility across GPT, Claude, and Gemini.",
    },
    {
      title: "Diagnose",
      description: "Identify authority gaps and semantic mismatch in real-time.",
    },
    {
      title: "Fix",
      description: "AI-suggested content optimizations to improve citations.",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
          Optimize for the next generation of search
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Join 5,000+ B2B marketing professionals using GEO to dominate AI-driven search results.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 py-4">
         {benefits.map((benefit, i) => (
           <div key={i} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-white/5">
             <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
             <div>
               <h3 className="text-sm font-bold text-slate-900 dark:text-white">{benefit.title}</h3>
               <p className="text-xs text-slate-500 dark:text-slate-400">{benefit.description}</p>
             </div>
           </div>
         ))}
      </div>

      <div className="space-y-6">
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-bold text-slate-700 dark:text-slate-300">First Name</label>
              <Input 
                id="firstName" 
                placeholder="Jane" 
                className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-bold text-slate-700 dark:text-slate-300">Last Name</label>
              <Input 
                id="lastName" 
                placeholder="Doe" 
                className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300">Work Email</label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@company.com" 
              className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 rounded-xl"
            />
          </div>
          <Button size="lg" className="w-full py-6 rounded-xl font-bold bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/20">
            Create Account
          </Button>
        </form>

        <p className="text-[10px] text-center text-slate-400 uppercase font-black tracking-widest px-4">
          By signing up, you agree to our <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>

      <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
