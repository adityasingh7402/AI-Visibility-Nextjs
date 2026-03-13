import { 
  BarChart3, 
  Lightbulb, 
  Zap, 
  HelpCircle,
  BrainCircuit,
  Settings2,
  Cpu,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export const metadata = {
  title: "New Analysis | GEO Platform",
};

export default function NewAnalysisPage() {
  const models = [
    { name: "GPT-4o", provider: "OpenAI", cost: "0.85", icon: <BrainCircuit className="text-emerald-500" /> },
    { name: "Claude 3.5 Sonnet", provider: "Anthropic", cost: "0.92", icon: <zap className="text-amber-500" size={20} /> },
    { name: "Gemini 1.5 Pro", provider: "Google", cost: "0.75", icon: <cpu className="text-primary" size={20} /> },
    { name: "Perplexity", provider: "Perplexity", cost: "1.10", icon: <Lightbulb className="text-blue-500" /> },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">New Analysis Configuration</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Configure your Generative Engine Optimization parameters for high-impact visibility.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Project Selection */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
               <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <BarChart3 size={18} className="text-primary" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">Project Selection</h3>
            </div>
            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 shadow-sm rounded-3xl">
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Target Project</label>
                     <Select>
                        <SelectTrigger className="h-12 bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/5 rounded-2xl">
                           <SelectValue placeholder="Select a project to analyze" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-slate-200 dark:border-white/10">
                           <SelectItem value="techradar">TechRadar SEO Audit</SelectItem>
                           <SelectItem value="retail">Global Retail Q4</SelectItem>
                           <SelectItem value="alpha">Alpha Labs Beta</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Prompt Style</label>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center gap-3 p-4 bg-primary/5 border-2 border-primary rounded-2xl text-left transition-all">
                           <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Zap size={16} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">Direct Inquiry</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Straightforward lookup</p>
                           </div>
                        </button>
                        <button className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-black/20 border-2 border-transparent hover:border-slate-200 dark:hover:border-white/10 rounded-2xl text-left transition-all">
                           <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-white/5 flex items-center justify-center text-slate-500 shrink-0">
                              <HelpCircle size={16} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">Comparison</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Competitive set context</p>
                           </div>
                        </button>
                     </div>
                  </div>
               </div>
            </Card>
          </section>

          {/* Model Selection */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
               <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <Cpu size={18} className="text-primary" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Model Selection</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {models.map((model) => (
                  <Card key={model.name} className="p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 shadow-sm rounded-3xl group cursor-pointer hover:border-primary/50 transition-all">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-slate-50 dark:bg-black/20 rounded-xl flex items-center justify-center">
                              {model.icon}
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">{model.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{model.provider}</p>
                           </div>
                        </div>
                        <div className="h-6 w-6 rounded-full border-2 border-slate-200 dark:border-white/10 group-hover:border-primary group-hover:bg-primary/10 transition-all"></div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Credit Cost</span>
                        <span className="text-sm font-black text-slate-900 dark:text-white">{model.cost} <span className="text-[10px] text-slate-400">/ 1k credits</span></span>
                     </div>
                  </Card>
               ))}
            </div>
          </section>

          {/* Quick Options */}
          <section className="bg-primary/5 border border-primary/10 p-6 rounded-3xl flex items-center justify-between">
             <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                   <Settings2 />
                </div>
                <div>
                   <h4 className="font-bold text-slate-900 dark:text-white">Keyword-only mode</h4>
                   <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">When active, the engine skips full context analysis and focuses purely on ranking keyword performance.</p>
                </div>
             </div>
             <Switch />
          </section>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
           <Card className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl sticky top-8">
              <h3 className="text-xl font-black mb-8 tracking-tight">Analysis Summary</h3>
              
              <div className="space-y-6 mb-10">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">Estimated Credits</span>
                    <span className="font-bold">1,240</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">Available Credits</span>
                    <span className="font-bold text-emerald-400">50,000</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">AI Engines</span>
                    <span className="font-bold">2 Multi-Pass</span>
                 </div>
                 <div className="h-[1px] bg-white/10"></div>
                 <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Balance After Run</span>
                    <span className="text-2xl font-black">48,760</span>
                 </div>
              </div>

              <div className="space-y-3">
                 <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-black h-14 rounded-2xl shadow-xl">
                    Run Analysis Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                 </Button>
                 <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-white/5 font-bold h-12 rounded-2xl">
                    Save as Draft
                 </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                 <div className="flex items-center gap-3 text-emerald-400">
                    <Zap size={16} />
                    <span className="text-xs font-black uppercase tracking-widest leading-none">Instant Queue Ready</span>
                 </div>
                 <p className="text-[10px] text-slate-500 mt-2 font-medium">Results are typically ready in 2-5 minutes depending on model selection.</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
