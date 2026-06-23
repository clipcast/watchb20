"use client";

export const dynamic = "force-dynamic";


import Link from "next/link";
import { useB20Token } from "@/hooks/useB20Token";
import { ConnectWallet } from "@/components/ConnectWallet";
import { TokenStats } from "@/components/tracker/TokenStats";
import { SupplyBar } from "@/components/tracker/SupplyBar";
import { HolderLookup } from "@/components/tracker/HolderLookup";
import { EXPLORER_URL } from "@/config/b20";

export default function TrackerPage({
  params,
}: {
  params: { address: string };
}) {
  const isValid = /^0x[a-fA-F0-9]{40}$/.test(params.address);
  const address = params.address as `0x${string}`;
  const { name, symbol, totalSupplyRaw, supplyCapRaw } = useB20Token(
    isValid ? address : "0x0000000000000000000000000000000000000000"
  );

  if (!isValid) {
    return (
      <main className="min-h-screen bg-[#07080d] text-white px-6 py-12">
        <div className="max-w-xl mx-auto wb-card p-6 text-center">
          <p style={{ color: "#ef4444" }}>Invalid token address.</p>
          <Link href="/tracker" className="text-[#3b82f6] underline text-sm mt-2 inline-block">
            ← Back to tracker
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.08)]">
        <Link href="/" className="font-bold text-lg">WatchB20</Link>
        <ConnectWallet />
      </nav>

      <section className="px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">
          {name ? `${name} Tracker` : "Token Tracker"}
          {symbol && <span className="text-[#3b82f6] ml-2">{symbol}</span>}
        </h1>
        <a
          href={`${EXPLORER_URL}/address/${address}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-[#3b82f6] underline font-mono"
        >
          {address} ↗
        </a>

        <div className="mt-8 grid gap-6">
          <TokenStats tokenAddress={address} />
          <SupplyBar totalSupply={totalSupplyRaw} supplyCap={supplyCapRaw} />
          <HolderLookup tokenAddress={address} />
        </div>
      </section>
    </main>
  );
}
