"use client";

import { formatUnits } from "viem";
import { useB20Token } from "@/hooks/useB20Token";

export function TokenStats({ address }: { address: `0x${string}` }) {
  const { token, isLoading } = useB20Token(address);

  if (isLoading) return <p>Loading token stats…</p>;

  const d = token.decimals ?? 18;

  return (
    <section style={{ display: "grid", gap: "0.5rem", margin: "1rem 0" }}>
      <div><strong>Name:</strong> {token.name ?? "—"}</div>
      <div><strong>Symbol:</strong> {token.symbol ?? "—"}</div>
      <div><strong>Decimals:</strong> {token.decimals ?? "—"}</div>
      <div>
        <strong>Total Supply:</strong>{" "}
        {token.totalSupply !== undefined ? formatUnits(token.totalSupply, d) : "—"}
      </div>
      <div>
        <strong>Max Supply:</strong>{" "}
        {token.maxSupply !== undefined ? formatUnits(token.maxSupply, d) : "—"}
      </div>
    </section>
  );
}
