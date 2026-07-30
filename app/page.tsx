"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, PackageSearch } from "lucide-react";

export default function Home() {
  const [orderCode, setOrderCode] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderCode.trim()) {
      router.push(`/track/${orderCode.trim()}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6">
      <div className="z-10 w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl transform transition-all">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-indigo-500 p-4 rounded-full mb-4 shadow-lg shadow-indigo-500/50">
              <PackageSearch className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white text-center tracking-tight">
              Lacak Pesanan
            </h1>
            <p className="text-indigo-200 mt-2 text-center text-sm">
              Masukkan kode pesanan jastip Anda
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-300" />
              </div>
              <input
                type="text"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                placeholder="Contoh: JST-1001"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-indigo-300/30 rounded-2xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0"
            >
              Cek Status Pesanan
            </button>
          </form>
        </div>
        
        <p className="text-center text-indigo-200/60 mt-8 text-sm">
          © {new Date().getFullYear()} Jastip Tracking. All rights reserved.
        </p>
      </div>
    </main>
  );
}
