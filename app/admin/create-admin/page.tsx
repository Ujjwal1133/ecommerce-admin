"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAdminPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/admin/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include", 
    });

    if (res.ok) {
      alert("Admin created successfully");
      router.push("/admin/dashboard");
    } else {
      alert("Unauthorized or failed");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-xl space-y-4 w-full max-w-md"
      >
        <h1 className="text-white text-2xl font-bold">
          Create New Admin
        </h1>

        <input
          placeholder="Username"
          className="w-full p-3 bg-zinc-800 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-zinc-800 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 py-3 rounded font-bold">
          CREATE ADMIN
        </button>
      </form>
    </div>
  );
}
