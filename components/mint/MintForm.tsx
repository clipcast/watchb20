"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useB20Token } from "@/hooks/useB20Token";
import { useMintBurn } from "@/hooks/useMintBurn";
import { EXPLORER_URL } from "@/config/b20";

export function MintForm({ tokenAddress }: { tokenAddress: `0x${string}` }) {
  const { address } = useAccount();
  const { decimals, supplyCapRaw, totalSupplyRaw, refetch } = useB20Token(tokenAddress);
  const { mint, isMinting, isConfirming, isSuccess, txHash, error } =
    useMintBurn(tokenAddress);

  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  function validate(): boolean {
    const recipient = to || address;
    if (!amount || Number(amount) <= 0) {
      setValidationError("Amount must be greater than 0");
      return false;
    }
    if (!recipient || !/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
      setValidationError("Invalid recipient address");
      return false;
    }
    setValidationError("");
    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const recipient = (to || address) as `0x${string}`;
    await mint(recipient, amount, decimals);
  }

  return (
    <form onSubmit={onSubmit} className="wb-card p-6 grid gap-4">
      <h3 className="font-semibold">Mint</h3>
      <div>
        <label className="block text-sm mb-1">Recipient</label>
        <input
          className="wb-input font-mono"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder={address ?? "0x… (default: you)"}
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Amount</label>
        <input
          className="wb-input"
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
        />
      </div>

      {validationError && <p className="text-sm" style={{ color: "#ef4444" }}>{validationError}</p>}
      {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}

      <button type="submit" disabled={isMinting || isConfirming} className="wb-btn wb-btn-primary">
        {isMinting ? "Confirm in wallet…" : isConfirming ? "Waiting for confirmation…" : "Mint"}
      </button>

      {isSuccess && txHash && (
        <a
          href={`${EXPLORER_URL}/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline font-mono"
          style={{ color: "#22c55e" }}
        >
          Minted ✓ — view tx
        </a>
      )}
    </form>
  );
}
