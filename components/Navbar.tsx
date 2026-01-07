import Link from 'next/link';
import { LayoutDashboard, Box, LineChart, FileText, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-6">
      <div className="flex items-center gap-2">
        <div className="bg-slate-900 p-2 rounded-lg">
          <Box className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">
          AdminOS
        </span>
      </div>
      
      <div className="hidden md:flex items-center bg-slate-200/50 backdrop-blur-md border border-white/20 p-1 rounded-full shadow-inner">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 px-5 py-2 bg-yellow-50 rounded-full text-sm font-semibold shadow-sm text-slate-900"
        >
          <LayoutDashboard size={16} /> Dashboard
        </Link>

        <Link
          href="/admin/products"
          className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:text-slate-900 rounded-full text-sm font-medium transition"
        >
          <Box size={16} /> Products
        </Link>

        <Link
          href="#"
          className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:text-slate-900 rounded-full text-sm font-medium transition"
        >
          <LineChart size={16} /> Analytics
        </Link>

        <Link
          href="#"
          className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:text-slate-900 rounded-full text-sm font-medium transition"
        >
          <FileText size={16} /> Forms
        </Link>

        <Link
          href="#"
          className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:text-slate-900 rounded-full text-sm font-medium transition"
        >
          <ShoppingCart size={16} /> Store
        </Link>
      </div>

      <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        <Link href="/admin/products" className="hover:text-slate-900 transition">
          Products
        </Link>
        <Link href="#" className="hover:text-slate-900 transition">
          Analytics
        </Link>
        <Link href="#" className="hover:text-slate-900 transition">
          Store
        </Link>
      </div>
    </nav>
  );
}
