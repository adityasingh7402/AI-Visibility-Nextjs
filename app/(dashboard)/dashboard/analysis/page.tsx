import { 
  FolderOpen,
  Brain,
  Info,
  Cpu,
  Zap,
  Check,
  PenSquare,
  Sparkles,
  HelpCircle,
  Key,
  Clock,
  Rocket,
  Settings2,
  ArrowRight,
  BrainCircuit,
  Lightbulb
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
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
    { name: "Claude 3.5 Sonnet", provider: "Anthropic", cost: "0.92", icon: <Zap className="text-amber-500" size={20} /> },
    { name: "Gemini 1.5 Pro", provider: "Google", cost: "0.75", icon: <Cpu className="text-primary" size={20} /> },
    { name: "Perplexity", provider: "Perplexity", cost: "1.10", icon: <Lightbulb className="text-blue-500" /> },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header matching Returns Page */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">New Analysis Configuration</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Configure your Generative Engine Optimization parameters for high-impact visibility.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Project Selection */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
               <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <FolderOpen className="h-5 w-5" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project Selection</h3>
            </div>
            <div className="max-w-md">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Select Target Project</label>
              <Select>
                <SelectTrigger className="w-full h-12 rounded-xl bg-slate-50 dark:bg-white/5 border-none font-medium">
                  <SelectValue placeholder="Choose a project..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 dark:border-white/10">
                  <SelectItem value="enterprise">Enterprise SaaS Q3 Expansion</SelectItem>
                  <SelectItem value="fintech">Fintech Content Strategy</SelectItem>
                  <SelectItem value="retail">Global Retail SEO Overhaul</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Prompt Styles */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Prompt Styles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Direct Question', 'Comparison', 'Recommendation', 'How-To Guide', 'Alternative List', 'Definition', 'Opinion Mining', 'Synthesized Summary'].map(style => (
                <label key={style} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 cursor-pointer group transition-colors">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="rounded-md text-primary focus:ring-primary h-5 w-5 border-slate-300 dark:border-white/10 dark:bg-slate-800 dark:checked:bg-primary" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{style}</span>
                  </div>
                  <Info className="text-slate-400 w-4 h-4 group-hover:text-primary transition-colors" />
                </label>
              ))}
            </div>
          </section>

          {/* AI Model Selection */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Model Selection</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {models.map((model) => (
                  <div key={model.name} className="p-5 bg-slate-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl group cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-all">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
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
                  </div>
               ))}
            </div>
          </section>

          {/* Quick Options */}
          <section className="bg-primary/5 border border-primary/10 p-6 rounded-3xl flex items-center justify-between">
             <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                   <Key className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="font-bold text-slate-900 dark:text-white">Keyword-only mode</h4>
                   <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">When active, the engine skips full context analysis and focuses purely on ranking keyword performance.</p>
                </div>
             </div>
             <Switch defaultChecked />
          </section>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
           <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-xl sticky top-8">
              <h3 className="text-2xl font-black mb-8 tracking-tight">Analysis Summary</h3>
              
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
                 <Button className="w-full bg-primary hover:bg-blue-600 text-white font-black h-14 rounded-2xl shadow-lg shadow-primary/20">
                    Start Analysis
                    <Rocket className="h-5 w-5 ml-2" />
                 </Button>
                 <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-white/5 font-bold h-12 rounded-2xl">
                    Save Draft
                 </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                 <div className="flex items-center gap-3 text-emerald-400 mb-2">
                    <Clock size={16} />
                    <span className="text-xs font-black uppercase tracking-widest leading-none">15-20 Mins ETA</span>
                 </div>
                 <p className="text-[10px] text-slate-500 font-medium">Results are typically ready in 2-5 minutes depending on model selection.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
