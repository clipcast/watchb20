"use client";

import { useB20Token } from "@/hooks/useB20Token";

export function SupplyBar({ address }: { address: `0x${string}` }) {
  const { token } = useB20Token(address);

  const total = token.totalSupply ?? 0n;
  const max = token.maxSupply ?? 0n;
  const pct = max > 0n ? Number((total * 10000n) / max) / 100 : 0;

  return (
    <div style={{ margin: "1rem 0" }}>
      <div style={{ fontSize: "0.85rem", marginBottom: "0.25rem" }}>
        Supply {pct.toFixed(2)}% of max
      </div>
      <div style={{ background: "#eee", borderRadius: 6, overflow: "hidden", height: 12 }}>
        <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: "#0052ff" }} />
      </div>
    </div>
  );
}
