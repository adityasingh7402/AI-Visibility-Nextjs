import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check } from "lucide-react";

export const metadata = {
  title: "Pricing | GEO Platform",
  description: "Simple, transparent pricing. Scale your Generative Engine Optimization presence as you grow.",
};

export default function PricingPage() {
  return (
    <main className="bg-background-light dark:bg-black w-full overflow-x-hidden">
      {/* Pricing Header */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Scale your GEO presence as you grow. Choose the best plan for your team.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Starter Plan */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col h-full shadow-sm">
            <h3 className="text-2xl font-bold mb-2 dark:text-white">Starter</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Perfect for small teams and solo markers.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black dark:text-white">$99</span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="text-emerald-500 h-5 w-5 shrink-0" />
                <span>5 Active Projects</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="text-emerald-500 h-5 w-5 shrink-0" />
                <span>Basic GEO Analysis</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="text-emerald-500 h-5 w-5 shrink-0" />
                <span>Weekly Search Reports</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="text-emerald-500 h-5 w-5 shrink-0" />
                <span>1 User Account</span>
              </li>
            </ul>
            <Button variant="outline" size="lg" className="w-full py-6 rounded-xl font-bold">Start Trial</Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-slate-900 dark:bg-slate-800 text-white p-10 rounded-3xl border border-slate-800 dark:border-white/10 ring-4 ring-primary ring-offset-4 ring-offset-background-light dark:ring-offset-black flex flex-col h-full shadow-xl relative scale-105 z-10">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="text-slate-400 text-sm mt-1">Everything in Starter plus advanced tools.</p>
              </div>
              <span className="bg-primary text-primary-foreground text-[10px] uppercase font-black px-2.5 py-1 rounded-full tracking-wide">Popular</span>
            </div>
            
            <div className="flex items-baseline gap-1 mt-6 mb-8">
              <span className="text-5xl font-black">$299</span>
              <span className="text-slate-400 font-medium">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-slate-200">
                <Check className="text-primary h-5 w-5 shrink-0" />
                <span>20 Active Projects</span>
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <Check className="text-primary h-5 w-5 shrink-0" />
                <span>Advanced GEO Suite</span>
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <Check className="text-primary h-5 w-5 shrink-0" />
                <span>Daily Rankings & Insights</span>
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <Check className="text-primary h-5 w-5 shrink-0" />
                <span>5 Team Seats</span>
              </li>
              <li className="flex items-center gap-3 text-slate-200">
                <Check className="text-primary h-5 w-5 shrink-0" />
                <span>Priority Chat Support</span>
              </li>
            </ul>
            <Button size="lg" className="w-full py-6 rounded-xl font-bold bg-primary hover:bg-blue-600 text-white">Start Trial</Button>
          </div>

          {/* Agency Plan */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col h-full shadow-sm">
            <h3 className="text-2xl font-bold mb-2 dark:text-white">Agency</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Customized for large-scale operations.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-black dark:text-white">Custom</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="text-emerald-500 h-5 w-5 shrink-0" />
                <span>Unlimited Projects</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="text-emerald-500 h-5 w-5 shrink-0" />
                <span>Real-time AI Influence Tracking</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="text-emerald-500 h-5 w-5 shrink-0" />
                <span>Whitelabel Reports</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="text-emerald-500 h-5 w-5 shrink-0" />
                <span>Unlimited User Accounts</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Check className="text-emerald-500 h-5 w-5 shrink-0" />
                <span>Dedicated Account Manager</span>
              </li>
            </ul>
            <Button variant="outline" size="lg" className="w-full py-6 rounded-xl font-bold">Contact Sales</Button>
          </div>
        </div>

        {/* One-off Analysis Add-on */}
        <div className="max-w-4xl mx-auto mt-16 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Just need a one-off analysis?</h4>
            <p className="text-slate-500 dark:text-slate-400">Run a complete GEO diagnostic for any URL without a subscription.</p>
          </div>
          <Button variant="outline" className="bg-white dark:bg-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shrink-0">
            Buy Report ($49)
          </Button>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-white dark:bg-slate-950 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-12 dark:text-white">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 data-[state=open]:bg-white dark:data-[state=open]:bg-slate-800 transition-colors px-6 rounded-xl data-[state=open]:shadow-md">
              <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-6">What exactly is Generative Engine Optimization (GEO)?</AccordionTrigger>
              <AccordionContent className="text-slate-500 dark:text-slate-400 text-base leading-relaxed pb-6">
                GEO stands for Generative Engine Optimization. It's the specialized process of improving your brand's visibility and positive attribution directly within Large Language Model answers (like ChatGPT or Perplexity), rather than traditional search engine result pages. 
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 data-[state=open]:bg-white dark:data-[state=open]:bg-slate-800 transition-colors px-6 rounded-xl data-[state=open]:shadow-md">
              <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-6">Can I switch my plan later on?</AccordionTrigger>
              <AccordionContent className="text-slate-500 dark:text-slate-400 text-base leading-relaxed pb-6">
                Absolutely. You can upgrade from Starter to Pro at any time, and your billing will simply be prorated for the remainder of the month.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/5 data-[state=open]:bg-white dark:data-[state=open]:bg-slate-800 transition-colors px-6 rounded-xl data-[state=open]:shadow-md">
              <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-6">Are the prompt analysis credits monthly or total?</AccordionTrigger>
              <AccordionContent className="text-slate-500 dark:text-slate-400 text-base leading-relaxed pb-6">
                Your prompt analysis credits refresh at the start of every billing cycle. Unused credits currently do not roll over to the next month to ensure maximum system performance.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
