"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { B20_TOKEN_ABI } from "@/config/b20";

export function HolderLookup({ address }: { address: `0x${string}` }) {
  const [holder, setHolder] = useState("");
  const [query, setQuery] = useState<`0x${string}` | undefined>();

  const { data: balance } = useReadContract({
    address,
    abi: B20_TOKEN_ABI,
    functionName: "balanceOf",
    args: query ? [query] : undefined,
    query: { enabled: Boolean(query) },
  });

  return (
    <section style={{ margin: "1rem 0" }}>
      <h3>Holder Lookup</h3>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          placeholder="0x… holder address"
          value={holder}
          onChange={(e) => setHolder(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={() => setQuery(holder as `0x${string}`)}>Look up</button>
      </div>
      {balance !== undefined && (
        <p>Balance: {formatUnits(balance as bigint, 18)}</p>
      )}
    </section>
  );
}
