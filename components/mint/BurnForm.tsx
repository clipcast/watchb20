"use client";

import { useEffect, useState } from "react";
import { useB20Token } from "@/hooks/useB20Token";
import { useMintBurn } from "@/hooks/useMintBurn";
import { EXPLORER_URL } from "@/config/b20";

export function BurnForm({ tokenAddress }: { tokenAddress: `0x${string}` }) {
  const { decimals, balance, balanceRaw, refetch } = useB20Token(tokenAddress);
  const { burn, isBurning, isConfirming, isSuccess, txHash, error } =
    useMintBurn(tokenAddress);

  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  function validate(): boolean {
    if (!amount || Number(amount) <= 0) {
      setValidationError("Amount must be greater than 0");
      return false;
    }
    if (Number(amount) > Number(balance)) {
      setValidationError("Amount exceeds your balance");
      return false;
    }
    setValidationError("");
    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await burn(amount, decimals);
  }

  return (
    <form onSubmit={onSubmit} className="wb-card p-6 grid gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Burn</h3>
        <span className="text-xs text-[rgba(200,196,188,0.6)] font-mono">
          Balance: {balance}
        </span>
      </div>
      <div>
        <label className="block text-sm mb-1">Amount</label>
        <div className="flex gap-2">
          <input
            className="wb-input"
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
          />
          <button
            type="button"
            onClick={() => setAmount(balance)}
            disabled={balanceRaw === 0n}
            className="wb-btn wb-btn-secondary text-sm"
          >
            Max
          </button>
        </div>
      </div>

      {validationError && <p className="text-sm" style={{ color: "#ef4444" }}>{validationError}</p>}
      {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}

      <button type="submit" disabled={isBurning || isConfirming} className="wb-btn wb-btn-primary">
        {isBurning ? "Confirm in wallet…" : isConfirming ? "Waiting for confirmation…" : "Burn"}
      </button>

      {isSuccess && txHash && (
        <a
          href={`${EXPLORER_URL}/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="text-sm underline font-mono"
          style={{ color: "#22c55e" }}
        >
          Burned ✓ — view tx
        </a>
      )}
    </form>
  );
}
