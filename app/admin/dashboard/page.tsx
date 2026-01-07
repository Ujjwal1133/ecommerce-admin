"use client";

import React, { useEffect, useState } from "react";
import {
  IndianRupee,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  Package,
  ShoppingBag,
  LogOut,
  UserPlus, // ✅ added icon (safe)
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  sales?: number;
}

export default function BusinessDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ STEP 4: check admin cookie (ONLY ADDITION)
  const isAdmin =
    typeof document !== "undefined" &&
    document.cookie.includes("admin=true");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.products || [];

        const itemsWithSales = items.map((p: Product) => ({
          ...p,
          sales: p.sales || Math.floor(Math.random() * 100) + 10,
        }));

        setProducts(itemsWithSales);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  function logout() {
    document.cookie = "admin=; Max-Age=0; path=/";
    router.push("/admin/login");
  }

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#05060a]">
        <Loader2 className="animate-spin text-blue-500" size={42} />
      </div>
    );

  const lowStockTop3 = [...products]
    .filter((p) => p.stock < 15)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 3);

  const topSelling = [...products]
    .sort((a, b) => (b.sales || 0) - (a.sales || 0))
    .slice(0, 5);

  const inventoryValue = products.reduce(
    (acc, curr) => acc + curr.price * curr.stock,
    0
  );

  return (
    <div className="min-h-screen bg-[#05060a] text-slate-200 px-8 py-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Business Overview
            </h1>
            <p className="text-slate-400">
              Performance and inventory analytics for today.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="bg-[#0b0f1a] border border-white/10 px-6 py-3 rounded-2xl font-bold hover:bg-red-500/10 hover:border-red-500/40 transition flex items-center gap-2 text-red-400"
            >
              <LogOut size={18} /> Logout
            </button>

            {/* INVENTORY */}
            <Link
              href="/admin/products"
              className="bg-[#0b0f1a] border border-white/10 px-6 py-3 rounded-2xl font-bold hover:bg-white/5 transition flex items-center gap-2"
            >
              <Package size={18} /> Inventory
            </Link>

            {/* EXPORT */}
            <button className="bg-white text-black px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition flex items-center gap-2">
              <ArrowUpRight size={18} /> Export Report
            </button>

            {/* ✅ STEP 4: ADMIN ONLY BUTTON (ADDED) */}
            {isAdmin && (
              <Link
                href="/admin/create-admin"
                className="bg-blue-600 px-6 py-3 rounded-2xl font-bold text-white hover:bg-blue-700 transition flex items-center gap-2"
              >
                <UserPlus size={18} /> Add Admin
              </Link>
            )}

          </div>
        </header>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0b0f1a] border border-white/10 rounded-[2rem] p-8 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <IndianRupee size={24} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Total Valuation
            </p>
            <h2 className="text-3xl font-black text-white">
              ₹{inventoryValue.toLocaleString()}
            </h2>
          </div>

          <div className="md:col-span-2 bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-red-400 font-bold flex items-center gap-2">
                <AlertTriangle size={20} /> Critical Stock (Top 3)
              </h3>
              <span className="text-red-500 text-xs font-black uppercase">
                Action Required
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lowStockTop3.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#0b0f1a] border border-red-500/20 rounded-xl p-4 flex justify-between items-center"
                >
                  <span className="font-bold truncate">{item.name}</span>
                  <span className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-lg font-black">
                    {item.stock} LEFT
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] p-8">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-white">
              <TrendingUp className="text-emerald-400" size={20} />
              Top Selling Products
            </h3>

            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={topSelling}>
                  <defs>
                    <linearGradient id="salesGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      background: "#020617",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#salesGlow)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] p-8">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <ShoppingBag className="text-blue-400" size={20} /> Stock Stats
            </h3>

            <div className="space-y-4">
              {products.slice(0, 6).map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-4 bg-white/5 rounded-2xl"
                >
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-black ${
                        item.stock < 15 ? "text-red-400" : "text-slate-400"
                      }`}
                    >
                      {item.stock}
                    </p>
                    <p className="text-[10px] uppercase text-slate-500">
                      In Stock
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin/products"
              className="block text-center mt-6 text-sm font-bold text-blue-400 hover:underline"
            >
              View All Inventory →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
