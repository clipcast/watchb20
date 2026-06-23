"use client";

import { useState } from "react";
import { useMintBurn } from "@/hooks/useMintBurn";

export function BurnForm({ address }: { address: `0x${string}` }) {
  const { burn, isPending } = useMintBurn(address);
  const [amount, setAmount] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await burn(amount);
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.5rem", margin: "1rem 0" }}>
      <h3>Burn</h3>
      <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button type="submit" disabled={isPending}>{isPending ? "Burning…" : "Burn"}</button>
    </form>
  );
}
