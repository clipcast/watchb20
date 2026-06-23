"use client";

import { formatUnits } from "viem";
import { MAX_UINT128 } from "@/config/b20";

function withCommas(value: string): string {
  const [int, dec] = value.split(".");
  const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec ? `${withSep}.${dec}` : withSep;
}

export function SupplyBar({
  totalSupply,
  supplyCap,
  decimals = 18,
}: {
  totalSupply: bigint;
  supplyCap: bigint;
  decimals?: number;
}) {
  const noCap = supplyCap === 0n || supplyCap >= MAX_UINT128;
  const pct =
    !noCap && supplyCap > 0n
      ? Number((totalSupply * 10000n) / supplyCap) / 100
      : 0;

  let fill = "#3b82f6";
  if (pct >= 95) fill = "#ef4444";
  else if (pct >= 80) fill = "#f59e0b";

  return (
    <div className="wb-card p-6">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-[rgba(200,196,188,0.6)]">Supply</span>
        <span className="font-mono">
          {withCommas(formatUnits(totalSupply, decimals))}
          {noCap ? " / No cap" : ` / ${withCommas(formatUnits(supplyCap, decimals))}`}
        </span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{ width: noCap ? "100%" : `${Math.min(pct, 100)}%`, background: noCap ? "#3b82f6" : fill }}
        />
      </div>
      {!noCap && (
        <div className="text-xs text-[rgba(200,196,188,0.6)] mt-2">{pct.toFixed(2)}% of cap</div>
      )}
    </div>
  );
}
