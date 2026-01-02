"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    // credentials
    if (username === "admin" && password === "admin123") {
      // set cookie
      document.cookie = "admin=true; path=/";

      // IMPORTANT: hard redirect so middleware sees cookie
      window.location.href = "/admin/products";
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05060a]">
      <div className="bg-white p-8 rounded-xl w-[360px]">
        <h1 className="text-2xl font-bold mb-6 text-black">
          Admin Login
        </h1>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 border rounded text-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded text-black"
        />

        <button
          onClick={login}
          className="w-full bg-black text-white py-3 rounded font-bold"
        >
          Login
        </button>
      </div>
    </div>
  );
}
