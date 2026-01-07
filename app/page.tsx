import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      
      <section className="max-w-7xl mx-auto px-10 pt-24 pb-20">
        <div className="flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200 shadow-sm mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              System Operational
            </span>
          </div>

          <h1 className="text-[120px] font-black text-slate-900 tracking-tighter leading-[0.8] mb-12">
            Streamline your <br /> 
            <span className="text-slate-900/80">operations.</span>
          </h1>

          <p className="max-w-xl text-xl text-slate-600 font-medium leading-relaxed mb-16">
            A comprehensive platform designed for efficient inventory control, 
            real-time analytics, and business insights.
          </p>

          <div className="w-full flex flex-col md:flex-row items-center md:items-end justify-between border-t border-slate-200 pt-10 mt-10">
            <div className="text-left max-w-[280px] mb-8 md:mb-0">
              <p className="text-slate-500 text-sm font-medium leading-snug">
                Comprehensive insurance for your data integrity. <br />
                Secure, fast, and reliable.
              </p>
            </div>

            <div className="flex items-center gap-10">
              <Link 
                href="/admin/dashboard" 
                className="text-slate-400 font-bold uppercase text-[11px] tracking-[0.2em] hover:text-slate-900 transition"
              >
                View Analytics
              </Link>
              
              <Link 
                href="/admin/login" 
                className="group flex items-center gap-4 bg-slate-900 text-white pl-10 pr-6 py-5 rounded-2xl font-bold text-lg transition-all hover:bg-slate-800 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
              >
                Get Started
                <div className="bg-white/10 p-1 rounded-md group-hover:translate-x-1 transition-transform">
                  <span className="text-xl">→</span>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
