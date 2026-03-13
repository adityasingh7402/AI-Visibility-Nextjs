import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
  title: "Contact Us | GEO Platform",
  description: "Get in touch with the GEO Platform team. We are ready to help you navigate the future of B2B marketing.",
};

export default function ContactPage() {
  return (
    <main className="bg-background-light dark:bg-black w-full min-h-screen">
      {/* Header */}
      <section className="pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Have questions about Generative Engine Optimization? Our team of experts is ready to help you navigate the future of B2B marketing.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="pb-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Content & Details */}
          <div className="space-y-12">
            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Technical Support</h3>
              <p className="text-primary font-medium mb-1">support@geo.ai</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">24/7 Response time</p>
            </div>
            
            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sales Inquiries</h3>
              <p className="text-primary font-medium mb-1">sales@geo.ai</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Mon-Fri 9am-6pm EST</p>
            </div>

            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Partnerships</h3>
              <p className="text-primary font-medium mb-1">partners@geo.ai</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Global partnership inquiries</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-white/5">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Send us a message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                  <Input id="firstName" placeholder="Jane" className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                  <Input id="lastName" placeholder="Doe" className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Work Email</label>
                <Input id="email" type="email" placeholder="jane@company.com" className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="How can we help your team?" 
                  className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-white/10 min-h-[150px] resize-y" 
                />
              </div>

              <Button size="lg" className="w-full py-6 rounded-xl text-lg font-bold">
                Send Message
              </Button>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
                Typical response time is under 12 hours. By submitting, you agree to our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </form>
          </div>

        </div>
      </section>
    </main>
  );
}
