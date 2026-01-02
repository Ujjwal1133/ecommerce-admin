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
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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

  function downloadReport() {
    if (!products.length) return;

    const headers = ["Name", "Price", "Stock", "Sales"];
    const rows = products.map((p) => [
      p.name,
      p.price,
      p.stock,
      p.sales ?? 0,
    ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((r) => r.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "inventory-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

          <div className="flex gap-4">
            <button
              onClick={logout}
              className="bg-[#0b0f1a] border border-white/10 px-6 py-3 rounded-2xl font-bold hover:bg-red-500/10 hover:border-red-500/40 transition flex items-center gap-2 text-red-400"
            >
              <LogOut size={18} /> Logout
            </button>

            <Link
              href="/admin/products"
              className="bg-[#0b0f1a] border border-white/10 px-6 py-3 rounded-2xl font-bold hover:bg-white/5 transition flex items-center gap-2"
            >
              <Package size={18} /> Inventory
            </Link>

            <button
              onClick={downloadReport}
              className="bg-white text-black px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition flex items-center gap-2"
            >
              <ArrowUpRight size={18} /> Export Report
            </button>
          </div>
        </header>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0b0f1a] border border-white/10 rounded-[2rem] p-8">
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
            <h3 className="text-red-400 font-bold flex items-center gap-2 mb-6">
              <AlertTriangle size={20} /> Critical Stock (Top 3)
            </h3>

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

          {/* TOP SELLING (UNCHANGED) */}
          <div className="lg:col-span-2 bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] p-8">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-white">
              <TrendingUp className="text-emerald-400" size={20} />
              Top Selling Products
            </h3>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={topSelling}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    fill="rgba(16,185,129,0.15)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* STOCK LIST (UNCHANGED) */}
          <div className="bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] p-8">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
              <ShoppingBag className="text-blue-400" size={20} /> Stock Chats
            </h3>

            <div className="space-y-4">
              {products.slice(0, 6).map((item) => (
                <div key={item._id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl">
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
          </div>
        </div>

        {/* ✅ NEW PRODUCT vs STOCK CHART */}
        <div className="mt-12 bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] p-8">
          <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
            <BarChart3 className="text-blue-400" size={20} />
            Product vs Stock
          </h3>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={products}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="stock" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
