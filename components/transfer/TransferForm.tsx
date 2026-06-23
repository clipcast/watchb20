"use client";

import { useEffect, useState } from "react";
import { useEstimateGas } from "wagmi";
import { encodeFunctionData, parseUnits, formatGwei } from "viem";
import { useB20Token } from "@/hooks/useB20Token";
import { useTransfer } from "@/hooks/useTransfer";
import { B20_ABI, EXPLORER_URL } from "@/config/b20";

interface Recipient {
  to: string;
  amount: string;
}

export function TransferForm({ tokenAddress }: { tokenAddress: `0x${string}` }) {
  const { decimals, balance, balanceRaw, refetch } = useB20Token(tokenAddress);
  const {
    transfer,
    batchTransfer,
    supportsBatching,
    isPending,
    isConfirming,
    isSuccess,
    txHash,
    error,
  } = useTransfer(tokenAddress);

  const [batchMode, setBatchMode] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([{ to: "", amount: "" }]);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess, refetch]);

  const { data: gasEstimate } = useEstimateGas({
    to: tokenAddress,
    data:
      !batchMode && /^0x[a-fA-F0-9]{40}$/.test(to) && Number(amount) > 0
        ? encodeFunctionData({
            abi: B20_ABI,
            functionName: "transfer",
            args: [to as `0x${string}`, parseUnits(amount || "0", decimals)],
          })
        : undefined,
    query: { enabled: !batchMode && /^0x[a-fA-F0-9]{40}$/.test(to) && Number(amount) > 0 },
  });

  function addRecipient() {
    if (recipients.length >= 10) return;
    setRecipients((r) => [...r, { to: "", amount: "" }]);
  }

  function updateRecipient(i: number, key: keyof Recipient, value: string) {
    setRecipients((r) => r.map((item, idx) => (idx === i ? { ...item, [key]: value } : item)));
  }

  function removeRecipient(i: number) {
    setRecipients((r) => r.filter((_, idx) => idx !== i));
  }

  function validateSingle(): boolean {
    if (!/^0x[a-fA-F0-9]{40}$/.test(to)) {
      setValidationError("Invalid recipient address");
      return false;
    }
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

  function validateBatch(): boolean {
    let total = 0;
    for (const r of recipients) {
      if (!/^0x[a-fA-F0-9]{40}$/.test(r.to)) {
        setValidationError("One or more recipient addresses are invalid");
        return false;
      }
      if (!r.amount || Number(r.amount) <= 0) {
        setValidationError("All amounts must be greater than 0");
        return false;
      }
      total += Number(r.amount);
    }
    if (total > Number(balance)) {
      setValidationError("Total exceeds your balance");
      return false;
    }
    setValidationError("");
    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (batchMode) {
      if (!validateBatch()) return;
      await batchTransfer(
        recipients.map((r) => ({ to: r.to as `0x${string}`, amount: r.amount })),
        decimals
      );
    } else {
      if (!validateSingle()) return;
      await transfer(to as `0x${string}`, amount, decimals);
    }
  }

  return (
    <form onSubmit={onSubmit} className="wb-card p-6 grid gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Transfer</h3>
        <span className="text-xs text-[rgba(200,196,188,0.6)] font-mono">Balance: {balance}</span>
      </div>

      {supportsBatching && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={batchMode} onChange={(e) => setBatchMode(e.target.checked)} />
          Batch mode (smart wallet) — up to 10 recipients
        </label>
      )}

      {!batchMode ? (
        <>
          <div>
            <label className="block text-sm mb-1">Recipient</label>
            <input className="wb-input font-mono" value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x…" />
          </div>
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <div className="flex gap-2">
              <input className="wb-input" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.0" />
              <button type="button" onClick={() => setAmount(balance)} disabled={balanceRaw === 0n} className="wb-btn wb-btn-secondary text-sm">
                Max
              </button>
            </div>
          </div>
          {gasEstimate !== undefined && (
            <p className="text-xs text-[rgba(200,196,188,0.6)]">
              Est. gas: {gasEstimate.toString()} units (~{formatGwei(gasEstimate)} gwei-units)
            </p>
          )}
        </>
      ) : (
        <div className="grid gap-3">
          {recipients.map((r, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className="wb-input font-mono"
                value={r.to}
                onChange={(e) => updateRecipient(i, "to", e.target.value)}
                placeholder="0x… recipient"
              />
              <input
                className="wb-input"
                type="number"
                min="0"
                value={r.amount}
                onChange={(e) => updateRecipient(i, "amount", e.target.value)}
                placeholder="amount"
                style={{ maxWidth: 120 }}
              />
              {recipients.length > 1 && (
                <button type="button" onClick={() => removeRecipient(i)} className="wb-btn wb-btn-secondary text-sm">
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRecipient}
            disabled={recipients.length >= 10}
            className="wb-btn wb-btn-secondary text-sm justify-self-start"
          >
            + Add recipient
          </button>
        </div>
      )}

      {validationError && <p className="text-sm" style={{ color: "#ef4444" }}>{validationError}</p>}
      {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}

      <button type="submit" disabled={isPending || isConfirming} className="wb-btn wb-btn-primary">
        {isPending ? "Confirm in wallet…" : isConfirming ? "Waiting for confirmation…" : "Send"}
      </button>

      {isSuccess && txHash && (
        <a href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-sm underline font-mono" style={{ color: "#22c55e" }}>
          Sent ✓ — view tx
        </a>
      )}
    </form>
  );
}
