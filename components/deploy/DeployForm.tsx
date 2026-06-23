"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useDeployB20 } from "@/hooks/useDeployB20";
import { EXPLORER_URL } from "@/config/b20";

export function DeployForm() {
  const { address } = useAccount();
  const { deploy, isPending, isConfirming, isSuccess, tokenAddress, error } =
    useDeployB20();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [validationError, setValidationError] = useState("");

  function validate(): boolean {
    if (!name.trim()) {
      setValidationError("Token name is required");
      return false;
    }
    if (symbol.length < 2 || symbol.length > 8) {
      setValidationError("Symbol must be 2-8 characters");
      return false;
    }
    if (!supply || Number(supply) <= 0) {
      setValidationError("Initial supply must be greater than 0");
      return false;
    }
    setValidationError("");
    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !address) return;
    await deploy({
      name: name.trim(),
      symbol: symbol.trim(),
      decimals: 18,
      supplyCap: supply,
      adminAddress: address,
    });
  }

  return (
    <form onSubmit={onSubmit} className="wb-card p-6 grid gap-4">
      <div>
        <label className="block text-sm mb-1">Token Name</label>
        <input
          className="wb-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Token"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Token Symbol</label>
        <input
          className="wb-input font-mono"
          value={symbol}
          maxLength={8}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="MTK"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Initial Supply</label>
        <input
          className="wb-input"
          type="number"
          min="0"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          placeholder="1000000"
        />
      </div>

      {validationError && (
        <p className="text-sm" style={{ color: "#ef4444" }}>{validationError}</p>
      )}
      {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}

      <button
        type="submit"
        disabled={isPending || isConfirming}
        className="wb-btn wb-btn-primary"
      >
        {isPending
          ? "Confirm in wallet…"
          : isConfirming
          ? "Waiting for confirmation…"
          : "Deploy Token"}
      </button>

      {isSuccess && tokenAddress && (
        <div className="text-sm" style={{ color: "#22c55e" }}>
          Deployed at{" "}
          <a
            href={`${EXPLORER_URL}/address/${tokenAddress}`}
            target="_blank"
            rel="noreferrer"
            className="underline font-mono"
          >
            {tokenAddress}
          </a>
        </div>
      )}
    </form>
  );
}
