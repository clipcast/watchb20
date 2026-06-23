"use client";

import { useState } from "react";
import { useTransfer } from "@/hooks/useTransfer";
import { useWalletCapabilities } from "@/hooks/useWalletCapabilities";

export function TransferForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const { transfer, isPending } = useTransfer(
    tokenAddress ? (tokenAddress as `0x${string}`) : undefined
  );
  const { supportsBatch } = useWalletCapabilities();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await transfer(to as `0x${string}`, amount);
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.5rem" }}>
      <input placeholder="Token address" value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} />
      <input placeholder="Recipient" value={to} onChange={(e) => setTo(e.target.value)} />
      <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button type="submit" disabled={isPending}>{isPending ? "Sending…" : "Send"}</button>
      <small style={{ opacity: 0.7 }}>
        EIP-5792 batch calls: {supportsBatch ? "supported ✓" : "not supported"}
      </small>
    </form>
  );
}
