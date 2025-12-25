"use client";

import { useEffect, useState } from "react";
import { productSchema } from "@/lib/validators";

type Product = {
  _id: string;
  name: string;
  price: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch products safely on load
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setProducts([]);
      }
    }

    fetchProducts();
  }, []);

  // ➕ Add product safely
  async function addProduct() {
    const result = productSchema.safeParse({
      name,
      price: Number(price),
    });

    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: Number(price),
        }),
      });

      if (!res.ok) {
        alert("Failed to add product");
        setLoading(false);
        return;
      }

      const newProduct = await res.json();
      setProducts((prev) => [...prev, newProduct]);

      setName("");
      setPrice("");
    } catch (error) {
      alert("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h1>Admin Products</h1>

      <h3>Add Product</h3>

      <input
        type="text"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br /><br />

      <button onClick={addProduct} disabled={loading}>
        {loading ? "Adding..." : "Add Product"}
      </button>

      <hr />

      <h3>Product List</h3>

      {products.length === 0 && <p>No products found.</p>}

      <ul>
        {Array.isArray(products) &&
          products.map((p) => (
            <li key={p._id}>
              {p.name} – ₹{p.price}
            </li>
          ))}
      </ul>
    </div>
  );
}
