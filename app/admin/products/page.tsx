"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
}

export default function BlackInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "", 
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileUpload = (file: File) => {
    setImageFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("price", formData.price);
    fd.append("stock", formData.stock);

    if (imageFile) {
      fd.append("image", imageFile);
    } else if (formData.image) {
      fd.append("image", formData.image);
    }

    if (editingId) {
      fd.append("id", editingId);
    }

    const res = await fetch("/api/products", {
      method: editingId ? "PUT" : "POST",
      body: fd, 
    });

    if (res.ok) {
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: "", price: "", stock: "", image: "" });
      setImageFile(null);
      setFilePreview(null);
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-red-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-10">
          <Link
            href="/admin/dashboard"
            className="bg-white text-black px-6 py-3 rounded-xl font-bold"
          >
            DASHBOARD
          </Link>

          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ name: "", price: "", stock: "", image: "" });
              setImageFile(null);
              setFilePreview(null);
              setIsModalOpen(true);
            }}
            className="bg-red-600 px-8 py-3 rounded-xl font-bold"
          >
            + ADD PRODUCT
          </button>
        </div>

        <div className="mb-6 relative max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-12 pr-4"
          />
        </div>

        <div className="space-y-4">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="grid grid-cols-4 items-center bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                {p.image ? (
                  <img
                    src={p.image}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-black border border-zinc-700 rounded-lg flex items-center justify-center text-xs text-zinc-500">
                    No Image
                  </div>
                )}
                <span className="font-bold">{p.name}</span>
              </div>

              <div>₹{p.price}</div>
              <div>{p.stock} Units</div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setEditingId(p._id);
                    setFormData({
                      name: p.name,
                      price: String(p.price),
                      stock: String(p.stock),
                      image: p.image || "",
                    });
                    setFilePreview(p.image || null);
                    setImageFile(null);
                    setIsModalOpen(true);
                  }}
                  className="p-2 bg-zinc-800 rounded-lg"
                >
                  <Edit size={18} />
                </button>

                <button
                  onClick={async () => {
                    if (confirm("Delete product?")) {
                      await fetch(`/api/products?id=${p._id}`, {
                        method: "DELETE",
                      });
                      fetchProducts();
                    }
                  }}
                  className="p-2 bg-zinc-800 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-950 p-8 rounded-2xl w-full max-w-md space-y-4"
          >
            <input
              placeholder="Product Name"
              className="w-full bg-zinc-900 p-3 rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Price"
              className="w-full bg-zinc-900 p-3 rounded"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />

            <input
              type="number"
              placeholder="Stock"
              className="w-full bg-zinc-900 p-3 rounded"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              required
            />

            <input
              placeholder="Image URL (optional)"
              className="w-full bg-zinc-900 p-3 rounded"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleFileUpload(e.target.files[0])
              }
              className="text-sm"
            />

            {filePreview && (
              <img
                src={filePreview}
                className="w-24 h-24 object-cover rounded border"
              />
            )}

            <button className="w-full bg-red-600 py-3 font-bold rounded">
              SAVE PRODUCT
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
