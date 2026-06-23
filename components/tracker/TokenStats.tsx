"use client";

import { useState } from "react";
import { useB20Token } from "@/hooks/useB20Token";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="wb-card p-4">
      <div className="text-xs text-[rgba(200,196,188,0.6)]">{label}</div>
      <div className="text-lg font-semibold mt-1 break-all">{value}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="wb-card p-4 animate-pulse">
      <div className="h-3 w-16 bg-[rgba(255,255,255,0.08)] rounded" />
      <div className="h-5 w-24 bg-[rgba(255,255,255,0.08)] rounded mt-2" />
    </div>
  );
}

export function TokenStats({ tokenAddress }: { tokenAddress: `0x${string}` }) {
  const { name, symbol, decimals, totalSupply, supplyCap, isLoading, isError, refetch } =
    useB20Token(tokenAddress);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(tokenAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="wb-card p-6 text-center">
        <p style={{ color: "#ef4444" }}>Failed to load token data.</p>
        <button onClick={() => refetch()} className="wb-btn wb-btn-secondary text-sm mt-3">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label="Name" value={name || "—"} />
        <StatCard label="Symbol" value={symbol || "—"} />
        <StatCard label="Decimals" value={String(decimals)} />
        <StatCard label="Total Supply" value={totalSupply} />
        <StatCard label="Supply Cap" value={supplyCap} />
      </div>
      <button onClick={copy} className="wb-btn wb-btn-secondary text-xs mt-3">
        {copied ? "Copied ✓" : "Copy token address"}
      </button>
    </div>
  );
}
