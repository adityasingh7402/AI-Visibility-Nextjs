import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup, loginWithGoogle } from "../actions";

export const metadata = {
  title: "Create Account | GEO Platform",
  description: "Join 5,000+ B2B marketing professionals using GEO to dominate AI-driven search results.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams;
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

      {message && (
        <div className={`rounded-xl p-4 border ${
          message.toLowerCase().includes('check your email')
            ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
            : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
        }`}>
          <p className={`text-sm font-medium ${
            message.toLowerCase().includes('check your email')
              ? 'text-blue-700 dark:text-blue-400'
              : 'text-red-700 dark:text-red-400'
          }`}>{message}</p>
        </div>
      )}

      <div className="space-y-6">
        <form action={signup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-bold text-slate-700 dark:text-slate-300">First Name</label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Jane"
                required
                className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-bold text-slate-700 dark:text-slate-300">Last Name</label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Doe"
                required
                className="h-12 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 rounded-xl"
              />
            </div>
          </div>
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
            <label htmlFor="password" className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
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
            Create Account
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200 dark:border-white/5" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-black px-4 text-slate-400 font-bold">Or sign up with</span>
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
