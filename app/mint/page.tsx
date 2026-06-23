"use client";

export const dynamic = "force-dynamic";


import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConnectWallet } from "@/components/ConnectWallet";

export default function MintIndexPage() {
  const router = useRouter();
  const [addr, setAddr] = useState("");
  const [err, setErr] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      setErr("Enter a valid token address");
      return;
    }
    router.push(`/mint/${addr}`);
  }

  return (
    <main className="min-h-screen bg-[#07080d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)]">
        <Link href="/" className="font-bold text-lg">WatchB20</Link>
        <ConnectWallet />
      </nav>
      <section className="px-6 py-12 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold">Mint / Burn a B20 Token</h1>
        <form onSubmit={go} className="wb-card p-6 mt-6 grid gap-4">
          <input
            className="wb-input font-mono"
            value={addr}
            onChange={(e) => setAddr(e.target.value)}
            placeholder="0x… token address"
          />
          {err && <p className="text-sm" style={{ color: "#ef4444" }}>{err}</p>}
          <button type="submit" className="wb-btn wb-btn-primary">Continue</button>
        </form>
      </section>
    </main>
  );
}
