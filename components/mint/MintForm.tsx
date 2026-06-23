"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useMintBurn } from "@/hooks/useMintBurn";

export function MintForm({ address }: { address: `0x${string}` }) {
  const { mint, isPending } = useMintBurn(address);
  const { address: account } = useAccount();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const recipient = (to || account) as `0x${string}`;
    await mint(recipient, amount);
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.5rem", margin: "1rem 0" }}>
      <h3>Mint</h3>
      <input placeholder="Recipient (default: you)" value={to} onChange={(e) => setTo(e.target.value)} />
      <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button type="submit" disabled={isPending}>{isPending ? "Minting…" : "Mint"}</button>
    </form>
  );
}
