import { AlertCircle } from 'lucide-react';

export default function InventoryTable({ products }: { products: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-50">
            <th className="pb-4">Name</th>
            <th className="pb-4">Stock</th>
            <th className="pb-4 text-right">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {products.map((p) => (
            <tr key={p._id} className="group hover:bg-slate-50/50 transition">
              <td className="py-4 font-bold text-slate-800">{p.name}</td>
              <td className="py-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  p.stock < 15 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {p.stock < 15 && <AlertCircle size={12} />}
                  {p.stock} units
                </span>
              </td>
              <td className="py-4 text-right font-black text-slate-600">
                ₹{p.price.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}