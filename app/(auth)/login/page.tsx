import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, loginWithGoogle } from "../actions";

export const metadata = {
  title: "Login | GEO Platform",
  description: "Access your Generative Engine Optimization dashboard and track your AI visibility.",
};

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Welcome back</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Access your Generative Engine Optimization dashboard.</p>
      </div>

      <div className="space-y-6">
        <form action={login} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300">Work Email</label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="name@company.com" 
              required
              className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
              <Link href="#" className="text-sm font-bold text-primary hover:underline">Forgot password?</Link>
            </div>
            <Input 
              id="password" 
              name="password"
              type="password" 
              placeholder="••••••••" 
              required
              className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 rounded-xl"
            />
          </div>
          <Button type="submit" size="lg" className="w-full py-6 rounded-xl font-bold bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/20">
            Sign In
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-white/5" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-black px-4 text-slate-400 font-bold">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <form action={loginWithGoogle}>
            <Button type="submit" variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200 dark:border-white/10 dark:text-white">
              <span className="mr-2 h-4 w-4 bg-slate-100 dark:bg-slate-800 rounded-full"></span>
              Google
            </Button>
          </form>
        </div>
      </div>

      <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
        Don't have an account?{" "}
        <Link href="/signup" className="text-primary font-bold hover:underline">
          Sign up for a free trial
        </Link>
      </p>
    </div>
  );
}
