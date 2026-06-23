"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { B20_ABI } from "@/config/b20";

export function HolderLookup({ tokenAddress }: { tokenAddress: `0x${string}` }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState<`0x${string}` | undefined>();
  const [err, setErr] = useState("");

  const { data, isLoading } = useReadContract({
    address: tokenAddress,
    abi: B20_ABI,
    functionName: "balanceOf",
    args: query ? [query] : undefined,
    query: { enabled: Boolean(query) },
  });

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: B20_ABI,
    functionName: "decimals",
  });

  function lookup(e: React.FormEvent) {
    e.preventDefault();
    if (!/^0x[a-fA-F0-9]{40}$/.test(input)) {
      setErr("Enter a valid wallet address");
      setQuery(undefined);
      return;
    }
    setErr("");
    setQuery(input as `0x${string}`);
  }

  const balance =
    data !== undefined
      ? formatUnits(data as bigint, (decimals as number | undefined) ?? 18)
      : undefined;

  return (
    <div className="wb-card p-6">
      <h3 className="font-semibold mb-3">Holder Lookup</h3>
      <form onSubmit={lookup} className="flex gap-2">
        <input
          className="wb-input font-mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="0x… wallet address"
        />
        <button type="submit" className="wb-btn wb-btn-primary text-sm whitespace-nowrap">
          Look up
        </button>
      </form>
      {err && <p className="text-sm mt-2" style={{ color: "#ef4444" }}>{err}</p>}
      {isLoading && query && <p className="text-sm mt-3 text-[rgba(200,196,188,0.6)]">Loading…</p>}
      {balance !== undefined && !isLoading && (
        <p className="text-sm mt-3">
          {Number(balance) === 0 ? (
            <span className="text-[rgba(200,196,188,0.6)]">No balance</span>
          ) : (
            <>Balance: <span className="font-mono">{balance}</span></>
          )}
        </p>
      )}
    </div>
  );
}
