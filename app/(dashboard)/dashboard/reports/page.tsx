import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ChevronRight,
  ArrowUpDown,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Reports | GEO Platform",
};

export default function ReportsHistoryPage() {
  const reports = [
    { name: "TechRadar SEO Audit", client: "TechRadar Inc.", date: "Oct 24, 2023", score: 82, engine: "Multi", status: "Completed" },
    { name: "Global Retail Q4", client: "Retail Dynamics", date: "Oct 21, 2023", score: 71, engine: "Google SGE", status: "Completed" },
    { name: "Alpha Labs Beta", client: "Alpha Ventures", date: "Oct 18, 2023", score: 65, engine: "ChatGPT", status: "Completed" },
    { name: "Solar Ventures", client: "Solaris Group", date: "Oct 15, 2023", score: 48, engine: "Claude", status: "Review" },
    { name: "EcoStream Baseline", client: "EcoStream", date: "Oct 12, 2023", score: 91, engine: "Multi", status: "Completed" },
    { name: "Nexus Pro Launch", client: "Nexus Corp", date: "Oct 10, 2023", score: 55, engine: "Google SGE", status: "Completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">All Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and view your historical GEO analysis reports.</p>
        </div>
        <div className="flex gap-3">
           <Button className="bg-primary hover:bg-blue-600 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
             New Report
           </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Filter by report name or client..." 
                className="pl-10 h-10 bg-slate-50 dark:bg-white/5 border-none rounded-xl"
              />
           </div>
           <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="rounded-lg border-slate-200 dark:border-white/10 dark:text-white h-10 font-bold">
                 <Filter className="h-4 w-4 mr-2" />
                 Filter
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg border-slate-200 dark:border-white/10 dark:text-white h-10 font-bold">
                 <Download className="h-4 w-4 mr-2" />
                 Export
              </Button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 underline-none">
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                       <button className="flex items-center gap-2 hover:text-slate-600 transition-colors">
                          Report Name <ArrowUpDown className="h-3 w-3" />
                       </button>
                    </th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Client</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Engine</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                 </tr>
              </thead>
              <tbody>
                 {reports.map((report, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <FileText className="h-5 w-5" />
                             </div>
                             <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                {report.name}
                             </span>
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">{report.client}</span>
                       </td>
                       <td className="px-6 py-5">
                          <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">{report.date}</span>
                       </td>
                       <td className="px-6 py-5 text-center">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">
                             {report.engine}
                          </span>
                       </td>
                       <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-2">
                             <div className="h-1.5 w-12 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${report.score > 75 ? 'bg-emerald-500' : report.score > 50 ? 'bg-primary' : 'bg-amber-500'}`} 
                                  style={{ width: `${report.score}%` }}
                                ></div>
                             </div>
                             <span className="text-sm font-black text-slate-900 dark:text-white">{report.score}%</span>
                          </div>
                       </td>
                       <td className="px-6 py-5 text-center">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                             report.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                          }`}>
                             {report.status}
                          </span>
                       </td>
                       <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 text-slate-300">
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-primary"><MoreHorizontal size={18} /></Button>
                             <ChevronRight size={18} className="group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        <div className="p-6 bg-slate-50/50 dark:bg-white/5 flex items-center justify-between">
           <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Showing 6 of 124 reports</p>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="rounded-lg h-9 px-4 font-bold border-slate-200 dark:border-white/5">Previous</Button>
              <Button variant="outline" size="sm" className="rounded-lg h-9 px-4 font-bold border-slate-200 dark:border-white/5 dark:text-white">Next</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
