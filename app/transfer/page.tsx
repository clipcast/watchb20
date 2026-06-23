"use client";

export const dynamic = "force-dynamic";


import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import { TransferForm } from "@/components/transfer/TransferForm";

function TransferInner() {
  const { isConnected } = useAccount();
  const searchParams = useSearchParams();
  const prefill = searchParams.get("token") ?? "";
  const [tokenAddress, setTokenAddress] = useState(prefill);
  const [confirmed, setConfirmed] = useState(/^0x[a-fA-F0-9]{40}$/.test(prefill));
  const [err, setErr] = useState("");

  function setToken(e: React.FormEvent) {
    e.preventDefault();
    if (!/^0x[a-fA-F0-9]{40}$/.test(tokenAddress)) {
      setErr("Enter a valid token address");
      return;
    }
    setErr("");
    setConfirmed(true);
  }

  return (
    <section className="px-6 py-12 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Transfer WCB</h1>

      {!isConnected ? (
        <div className="wb-card p-6 mt-6 text-center">
          <p className="text-[rgba(200,196,188,0.6)] mb-4">Connect a wallet to transfer tokens.</p>
          <ConnectWallet />
        </div>
      ) : !confirmed ? (
        <form onSubmit={setToken} className="wb-card p-6 mt-6 grid gap-4">
          <label className="block text-sm">Token Address</label>
          <input
            className="wb-input font-mono"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x… token address"
          />
          {err && <p className="text-sm" style={{ color: "#ef4444" }}>{err}</p>}
          <button type="submit" className="wb-btn wb-btn-primary">Continue</button>
        </form>
      ) : (
        <div className="mt-6">
          <TransferForm tokenAddress={tokenAddress as `0x${string}`} />
        </div>
      )}
    </section>
  );
}

export default function TransferPage() {
  return (
    <main className="min-h-screen bg-[#07080d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)]">
        <Link href="/" className="font-bold text-lg">WatchB20</Link>
        <ConnectWallet />
      </nav>
      <Suspense fallback={<div className="px-6 py-12 text-center">Loading…</div>}>
        <TransferInner />
      </Suspense>
    </main>
  );
}
